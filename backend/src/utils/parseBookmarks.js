const xml2js = require('xml2js');

/**
 * Detect browser from HTML bookmark export content
 */
const detectBrowser = (content, filename = '') => {
  const lower = (content || '').toLowerCase();
  const fileLower = (filename || '').toLowerCase();

  if (lower.includes('edge') || fileLower.includes('edge')) return 'Edge';
  if (lower.includes('brave') || fileLower.includes('brave')) return 'Brave';
  if (lower.includes('firefox') || lower.includes('netscape') || fileLower.includes('firefox')) return 'Firefox';
  if (lower.includes('safari') || fileLower.includes('safari')) return 'Safari';
  if (lower.includes('chrome') || fileLower.includes('chrome')) return 'Chrome';
  return 'Other';
};

/**
 * Parse Netscape Bookmark HTML format (Chrome, Firefox, Edge, Brave, Safari all use this)
 */
const parseNetscapeHTML = (content, defaultBrowser = 'Other') => {
  const bookmarks = [];

  // Extract all <A> tags with their context
  const anchorRegex = /<A\s+([^>]+)>(.*?)<\/A>/gi;
  let match;

  while ((match = anchorRegex.exec(content)) !== null) {
    const attrs = match[1];
    const title = match[2].replace(/<[^>]+>/g, '').trim();

    // Extract href
    const hrefMatch = attrs.match(/HREF="([^"]+)"/i);
    if (!hrefMatch) continue;

    const url = hrefMatch[1];
    if (!url || url.startsWith('javascript:') || url.startsWith('data:')) continue;

    // Extract add date
    const addDateMatch = attrs.match(/ADD_DATE="(\d+)"/i);
    const addDate = addDateMatch ? new Date(parseInt(addDateMatch[1]) * 1000) : new Date();

    bookmarks.push({
      title: title || url,
      url,
      addedAt: addDate,
      browserSource: defaultBrowser,
    });
  }

  return bookmarks;
};

/**
 * Parse JSON bookmark export (Chrome's bookmark manager JSON)
 */
const parseChromeJSON = (content) => {
  const bookmarks = [];

  const traverseNodes = (nodes, browserSource = 'Chrome') => {
    if (!Array.isArray(nodes)) return;

    for (const node of nodes) {
      if (node.type === 'url' && node.url) {
        if (node.url.startsWith('javascript:') || node.url.startsWith('data:')) continue;

        bookmarks.push({
          title: node.name || node.url,
          url: node.url,
          addedAt: node.date_added ? new Date(parseInt(node.date_added) / 1000) : new Date(),
          browserSource,
          originalFolder: null,
        });
      } else if (node.type === 'folder' && node.children) {
        traverseNodes(node.children, browserSource);
      } else if (node.children) {
        traverseNodes(node.children, browserSource);
      }
    }
  };

  try {
    const data = JSON.parse(content);
    // Chrome bookmark JSON structure
    if (data.roots) {
      const roots = data.roots;
      if (roots.bookmark_bar?.children) traverseNodes(roots.bookmark_bar.children);
      if (roots.other?.children) traverseNodes(roots.other.children);
      if (roots.synced?.children) traverseNodes(roots.synced.children);
    } else if (Array.isArray(data)) {
      traverseNodes(data);
    }
  } catch {
    // Not valid JSON
  }

  return bookmarks;
};

/**
 * Parse plain text list of URLs
 */
const parsePlainText = (content, defaultBrowser = 'Other') => {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const bookmarks = [];
  const urlRegex = /^(https?:\/\/[^\s]+)/i;

  for (const line of lines) {
    const match = line.match(urlRegex);
    if (match) {
      bookmarks.push({
        title: line.replace(match[1], '').trim() || match[1],
        url: match[1],
        addedAt: new Date(),
        browserSource: defaultBrowser,
      });
    }
  }

  return bookmarks;
};

/**
 * Main parser - auto-detects format
 */
const parseBookmarkFile = (content, filename = '') => {
  const browser = detectBrowser(content, filename);

  // Try Chrome JSON format first
  if (filename.endsWith('.json')) {
    const results = parseChromeJSON(content);
    if (results.length > 0) return { bookmarks: results, detectedBrowser: 'Chrome' };
  }

  // Try Netscape HTML format
  if (content.includes('<!DOCTYPE NETSCAPE-Bookmark-file') ||
      content.includes('<DL>') ||
      content.includes('<A HREF') ||
      filename.endsWith('.html') ||
      filename.endsWith('.htm')) {
    const results = parseNetscapeHTML(content, browser);
    if (results.length > 0) return { bookmarks: results, detectedBrowser: browser };
  }

  // Fallback: plain text
  const results = parsePlainText(content, browser);
  return { bookmarks: results, detectedBrowser: browser };
};

/**
 * Get favicon URL for a domain
 */
const getFaviconUrl = (url) => {
  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return null;
  }
};

module.exports = { parseBookmarkFile, detectBrowser, getFaviconUrl };
