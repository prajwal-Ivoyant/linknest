const { TOPIC_CATEGORIES } = require('../models/Bookmark');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE = 'https://api.groq.com/openai/v1';

// ─── Helper — call Gemini text generation ────────────────────────────────────

const callGemini = async (prompt) => {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 300,
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Groq API error');
  return data.choices?.[0]?.message?.content ?? '';
};

// ─── Fallback (no API key / error) ───────────────────────────────────────────

const fallback = (bookmark) => ({
  title: bookmark.title || bookmark.url,
  description: '',
  tags: [],
  topicCategory: 'Other',
  confidence: 0,
  aiCategorized: false,
});

// ─── Full AI Analysis — Single URL ───────────────────────────────────────────
// Used when user manually adds a single URL via the Add/Import URL modal.

const analyzeBookmark = async (bookmark) => {
  console.log('🔑 KEY:', GROQ_API_KEY ? 'FOUND ✅' : 'MISSING ❌');
  if (!GROQ_API_KEY) return fallback(bookmark);

  try {
    const prompt = `You are an intelligent bookmark assistant.

Analyze the following bookmark and generate:
- A clean, readable title (use the provided title if good, improve if vague)
- A short description (max 25 words, what this page is actually about)
- 3 to 6 relevant lowercase tags
- ONE topic category from this exact list: ${TOPIC_CATEGORIES.join(', ')}
- A confidence score between 0 and 1

Respond ONLY with valid JSON — no markdown, no explanation:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", "tag3"],
  "topicCategory": "Development",
  "confidence": 0.93
}

Bookmark:
Title: ${bookmark.title || 'Unknown'}
URL: ${bookmark.url}`;

    const raw = await callGemini(prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    console.log('========== AI PARSED ==========');
    console.log(parsed);
    console.log('================================');

    return {
      title: parsed.title || bookmark.title || bookmark.url,
      description: parsed.description || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
      topicCategory: TOPIC_CATEGORIES.includes(parsed.topicCategory)
        ? parsed.topicCategory
        : 'Other',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
      aiCategorized: true,
    };
  } catch (err) {
    console.error('AI analyzeBookmark error:', err.message);
    return fallback(bookmark);
  }
};

// ─── Single Categorize (wraps analyzeBookmark) ────────────────────────────────

const categorizeBookmark = async (bookmark) => {
  const result = await analyzeBookmark(bookmark);
  return {
    category: result.topicCategory,
    confidence: result.confidence,
    aiCategorized: result.aiCategorized,
  };
};

// ─── Batch Categorize — for large file imports ────────────────────────────────
// Sends 20 bookmarks per API call for speed + cost efficiency.

const batchCategorizeBookmarks = async (bookmarks) => {
  if (!GROQ_API_KEY) return bookmarks.map((b) => ruleBasedCategorize(b));

  const BATCH_SIZE = 20;
  const results = [];

  for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
    const batch = bookmarks.slice(i, i + BATCH_SIZE);

    try {
      const bookmarkList = batch
        .map((b, idx) => `${idx + 1}. Title: "${b.title || 'Unknown'}" | URL: ${b.url}`)
        .join('\n');

      const prompt = `You are a bookmark categorization assistant. Classify each bookmark into exactly ONE category from this list:
${TOPIC_CATEGORIES.join(', ')}

Bookmarks:
${bookmarkList}

Respond ONLY with a valid JSON array with exactly ${batch.length} objects (no markdown, no explanation):
[{"category": "Development", "confidence": 0.95}, ...]`;

      const raw = await callGemini(prompt);
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      batch.forEach((_, idx) => {
        const item = Array.isArray(parsed) ? parsed[idx] : null;
        results.push({
          category: item && TOPIC_CATEGORIES.includes(item.category) ? item.category : 'Other',
          confidence: item?.confidence ?? 0.8,
          aiCategorized: true,
        });
      });
    } catch (err) {
      console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, err.message);
      batch.forEach((b) => results.push(ruleBasedCategorize(b)));
    }

    // Throttle between batches (Gemini free tier: 15 req/min)
    if (i + BATCH_SIZE < bookmarks.length) {
      await new Promise((r) => setTimeout(r, 4000)); // 4s gap keeps you under rate limit
    }
  }

  return results;
};

// ─── Rule-based Fallback ──────────────────────────────────────────────────────

const ruleBasedCategorize = (bookmark) => {
  const text = ((bookmark.url || '') + ' ' + (bookmark.title || '')).toLowerCase();

  const rules = [
    { category: 'AI', patterns: ['openai', 'anthropic', 'huggingface', 'gpt', 'claude', 'llm', 'deeplearning', 'machinelearning', 'midjourney', 'stablediffusion'] },
    { category: 'Development', patterns: ['github', 'stackoverflow', 'npm', 'docker', 'kubernetes', 'api', 'developer', 'code', 'programming', 'git', 'vercel', 'netlify'] },
    { category: 'Design', patterns: ['figma', 'dribbble', 'behance', 'awwwards', 'css', 'design', 'ui', 'ux', 'sketch', 'canva', 'adobe'] },
    { category: 'Learning', patterns: ['udemy', 'coursera', 'youtube.com/watch', 'tutorial', 'learn', 'course', 'education', 'khan', 'medium.com', 'freecodecamp'] },
    { category: 'Finance', patterns: ['finance', 'invest', 'stock', 'crypto', 'bank', 'trading', 'bloomberg', 'coinbase', 'binance'] },
    { category: 'News', patterns: ['news', 'cnn', 'bbc', 'nytimes', 'reuters', 'techcrunch', 'hackernews', 'ycombinator', 'theverge'] },
    { category: 'Social', patterns: ['twitter', 'linkedin', 'facebook', 'instagram', 'reddit', 'discord', 'slack', 'x.com'] },
    { category: 'Tools', patterns: ['tool', 'app', 'software', 'extension', 'plugin', 'notion', 'trello', 'airtable', 'linear', 'jira'] },
    { category: 'Productivity', patterns: ['productivity', 'obsidian', 'roamresearch', 'todoist', 'calendar', 'task', 'workflow'] },
    { category: 'Entertainment', patterns: ['netflix', 'spotify', 'twitch', 'game', 'movie', 'music', 'podcast'] },
    { category: 'Science', patterns: ['arxiv', 'science', 'research', 'paper', 'study', 'pubmed', 'nature.com'] },
    { category: 'Health', patterns: ['health', 'fitness', 'medical', 'doctor', 'nutrition', 'workout', 'gym'] },
  ];

  for (const rule of rules) {
    if (rule.patterns.some((p) => text.includes(p))) {
      return { category: rule.category, confidence: 0.65, aiCategorized: false };
    }
  }

  return { category: 'Other', confidence: 0.5, aiCategorized: false };
};

module.exports = {
  analyzeBookmark,
  categorizeBookmark,
  batchCategorizeBookmarks,
  ruleBasedCategorize,
};