const mongoose = require('mongoose');

const BROWSER_SOURCES = ['Chrome', 'Edge', 'Brave', 'Firefox', 'Safari', 'Other'];
const TOPIC_CATEGORIES = [
  'AI', 'Development', 'Design', 'Learning', 'Finance',
  'News', 'Social', 'Tools', 'Entertainment', 'Science',
  'Health', 'Business', 'Productivity', 'Security', 'Other',
];

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    favicon: {
      type: String,
      default: null,
    },
    // Level 1: Browser Source
    browserSource: {
      type: String,
      enum: BROWSER_SOURCES,
      default: 'Other',
    },
    // Level 2: AI-generated topical category
    topicCategory: {
      type: String,
      enum: TOPIC_CATEGORIES,
      default: 'Other',
    },
    // AI categorization metadata
    aiCategorized: {
      type: Boolean,
      default: false,
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    // Manual override flag
    manuallyEdited: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    lastVisited: {
      type: Date,
      default: null,
    },
    // Original folder path from browser export
    originalFolder: {
      type: String,
      default: null,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient querying
bookmarkSchema.index({ user: 1, browserSource: 1 });
bookmarkSchema.index({ user: 1, topicCategory: 1 });
bookmarkSchema.index({ user: 1, isFavorite: 1 });
bookmarkSchema.index({ user: 1, isArchived: 1 });
bookmarkSchema.index({ user: 1, createdAt: -1 });

// Text search index
bookmarkSchema.index({ title: 'text', url: 'text', description: 'text', tags: 'text' });

// Virtual for domain extraction
bookmarkSchema.virtual('domain').get(function () {
  try {
    return new URL(this.url).hostname.replace('www.', '');
  } catch {
    return this.url;
  }
});

bookmarkSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
module.exports.BROWSER_SOURCES = BROWSER_SOURCES;
module.exports.TOPIC_CATEGORIES = TOPIC_CATEGORIES;
