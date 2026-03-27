const express = require('express');
const router = express.Router();
const multer = require('multer');
const Joi = require('joi');
const Bookmark = require('../models/Bookmark');
const { BROWSER_SOURCES, TOPIC_CATEGORIES } = require('../models/Bookmark');
const { authenticate } = require('../middleware/auth');
const {
  analyzeBookmark,
  categorizeBookmark,
  batchCategorizeBookmarks,
  ruleBasedCategorize,
} = require('../services/aiService');
const { parseBookmarkFile, getFaviconUrl } = require('../utils/parseBookmarks');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['text/html', 'application/json', 'text/plain'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(html|htm|json|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only HTML, JSON, and TXT files are allowed'));
    }
  },
});

const bookmarkSchema = Joi.object({
  title: Joi.string().max(500).required(),
  url: Joi.string().uri().required(),
  description: Joi.string().max(1000).allow('').optional(),
  browserSource: Joi.string().valid(...BROWSER_SOURCES).optional(),
  topicCategory: Joi.string().valid(...TOPIC_CATEGORIES).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isFavorite: Joi.boolean().optional(),
});

router.use(authenticate);

// ─── GET /api/bookmarks ───────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 50,
      browserSource, topicCategory,
      isFavorite, isArchived = false,
      search, sortBy = 'createdAt', sortOrder = 'desc', tags,
    } = req.query;

    const query = { user: req.user._id };
    if (browserSource && browserSource !== 'all') query.browserSource = browserSource;
    if (topicCategory && topicCategory !== 'all') query.topicCategory = topicCategory;
    if (isFavorite === 'true') query.isFavorite = true;
    query.isArchived = isArchived === 'true';
    if (tags) query.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()) };
    if (search) query.$text = { $search: search };

    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookmarks, total] = await Promise.all([
      Bookmark.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean({ virtuals: true }),
      Bookmark.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        bookmarks,
        pagination: {
          page: parseInt(page), limit: parseInt(limit),
          total, pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) {
    console.error('List bookmarks error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/bookmarks/stats ─────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, favorites, byBrowser, byTopic, recentlyAdded] = await Promise.all([
      Bookmark.countDocuments({ user: userId, isArchived: false }),
      Bookmark.countDocuments({ user: userId, isFavorite: true, isArchived: false }),
      Bookmark.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: '$browserSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Bookmark.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: '$topicCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Bookmark.find({ user: userId, isArchived: false })
        .sort({ createdAt: -1 }).limit(5).lean({ virtuals: true }),
    ]);

    res.json({
      success: true,
      data: {
        total, favorites,
        byBrowser: byBrowser.map((b) => ({ name: b._id, count: b.count })),
        byTopic: byTopic.map((t) => ({ name: t._id, count: t.count })),
        recentlyAdded,
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/bookmarks/grouped ───────────────────────────────────────────────
// Powers the Kanban board.
// ?by=browserSource            → group all bookmarks by browser (Level 1)
// ?by=topicCategory&browserSource=Chrome → group Chrome bookmarks by topic (Level 2)
// ?browserSource=Chrome&topicCategory=Development → flat list for focused view (Level 3)

router.get('/grouped', async (req, res) => {
  try {
    const {
      by,                      // 'browserSource' | 'topicCategory'
      browserSource,
      topicCategory,
      limit = 30,              // max cards per column
      isArchived = false,
      search,                  // text search query
    } = req.query;

    const baseQuery = {
      user: req.user._id,
      isArchived: isArchived === 'true',
    };

    // Apply text search if provided
    if (search) {
      baseQuery.$text = { $search: search };
    }

    // Level 3: both filters set → flat list
    if (browserSource && browserSource !== 'all' && topicCategory && topicCategory !== 'all') {
      const bookmarks = await Bookmark.find({
        ...baseQuery,
        browserSource,
        topicCategory,
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean({ virtuals: true });

      const total = await Bookmark.countDocuments({ ...baseQuery, browserSource, topicCategory });

      return res.json({
        success: true,
        data: {
          mode: 'flat',
          bookmarks,
          total,
          browserSource,
          topicCategory,
        },
      });
    }

    // Level 1 & 2: group by field
    const groupField = by === 'topicCategory' ? 'topicCategory' : 'browserSource';

    // Apply cross-filters to baseQuery so columns are scoped correctly:
    // e.g. browserSource='all' + topicCategory='Development' → browser columns showing only Dev bookmarks
    // e.g. browserSource='Chrome' + topicCategory='all' → topic columns showing only Chrome bookmarks
    if (browserSource && browserSource !== 'all') {
      baseQuery.browserSource = browserSource;
    }
    if (topicCategory && topicCategory !== 'all') {
      baseQuery.topicCategory = topicCategory;
    }

    // Get all distinct group values that exist for this user
    const distinctGroups = await Bookmark.distinct(groupField, baseQuery);

    // Fetch bookmarks for each group in parallel
    const groupResults = await Promise.all(
      distinctGroups.map(async (groupValue) => {
        const groupQuery = { ...baseQuery, [groupField]: groupValue };
        const [bookmarks, total] = await Promise.all([
          Bookmark.find(groupQuery)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean({ virtuals: true }),
          Bookmark.countDocuments(groupQuery),
        ]);
        return { name: groupValue, bookmarks, total };
      })
    );

    // Sort columns: most bookmarks first
    groupResults.sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      data: {
        mode: 'kanban',
        groupBy: groupField,
        groups: groupResults,
      },
    });
  } catch (err) {
    console.error('Grouped bookmarks error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/bookmarks/:id ───────────────────────────────────────────────────

router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id }).lean({ virtuals: true });
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });
    res.json({ success: true, data: { bookmark } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/bookmarks ──────────────────────────────────────────────────────

router.post('/', async (req, res) => {
  try {
    const { error, value } = bookmarkSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    let { title, description, tags, topicCategory } = value;
    let aiCategorized = false;
    let aiConfidence = 0;

    if (!topicCategory) {
      const analysis = await analyzeBookmark({ url: value.url, title });
      title = title || analysis.title;
      description = description || analysis.description;
      tags = (tags && tags.length) ? tags : analysis.tags;
      topicCategory = analysis.topicCategory;
      aiCategorized = analysis.aiCategorized;
      aiConfidence = analysis.confidence;
    }

    const bookmark = await Bookmark.create({
      ...value,
      title, description, tags,
      user: req.user._id,
      topicCategory, aiCategorized, aiConfidence,
      favicon: getFaviconUrl(value.url),
    });

    res.status(201).json({ success: true, data: { bookmark: bookmark.toJSON() } });
  } catch (err) {
    console.error('Create bookmark error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/bookmarks/:id ─────────────────────────────────────────────────

router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['title', 'url', 'description', 'browserSource', 'topicCategory', 'tags', 'isFavorite', 'isArchived'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.browserSource || updates.topicCategory) updates.manuallyEdited = true;

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });
    res.json({ success: true, data: { bookmark } });
  } catch (err) {
    console.error('Update bookmark error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/bookmarks/:id ────────────────────────────────────────────────

router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });
    res.json({ success: true, message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/bookmarks/bulk/delete ───────────────────────────────────────

router.delete('/bulk/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'IDs array required' });
    }
    const result = await Bookmark.deleteMany({ _id: { $in: ids }, user: req.user._id });
    res.json({ success: true, message: `${result.deletedCount} bookmarks deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/bookmarks/import/file ─────────────────────────────────────────

router.post('/import/url', async (req, res) => {
  try {
    const { url, title, browserSource = 'Other' } = req.body;
    if (!url)
      return res.status(400).json({ success: false, message: 'URL is required' });

    // ⭐ AI analyze ONLY
    const analysis = await analyzeBookmark({ url, title });

    // ⭐ DO NOT SAVE TO DB HERE
    const previewBookmark = {
      url,
      title: analysis.title,
      description: analysis.description,
      tags: analysis.tags,
      browserSource,
      topicCategory: analysis.topicCategory,
      aiCategorized: analysis.aiCategorized,
      aiConfidence: analysis.confidence,
      favicon: getFaviconUrl(url),
    };

    // ⭐ Return preview only
    res.status(200).json({
      success: true,
      data: { bookmark: previewBookmark },
    });

  } catch (err) {
    console.error('Import URL error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/bookmarks/import/url ──────────────────────────────────────────

router.post('/import/url', async (req, res) => {
  try {
    const { url, title, browserSource = 'Other' } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    const analysis = await analyzeBookmark({ url, title });

    const created = await Bookmark.create({
      url,
      title: analysis.title,
      description: analysis.description,
      tags: analysis.tags,
      browserSource,
      topicCategory: analysis.topicCategory,
      aiCategorized: analysis.aiCategorized,
      aiConfidence: analysis.confidence,
      user: req.user._id,
      favicon: getFaviconUrl(url),
    });

    res.status(201).json({ success: true, data: { bookmark: created.toJSON() } });
  } catch (err) {
    console.error('Import URL error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/bookmarks/:id/visit ───────────────────────────────────────────

router.post('/:id/visit', async (req, res) => {
  try {
    await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { visitCount: 1 }, lastVisited: new Date() }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;