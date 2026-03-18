import type { BrowserSource, TopicCategory } from '../types';

export const BROWSER_COLORS: Record<BrowserSource, string> = {
  Chrome: '#4285F4',
  Edge: '#0078D4',
  Brave: '#FB542B',
  Firefox: '#FF7139',
  Safari: '#006CFF',
  Other: '#9491a8',
};

export const BROWSER_EMOJIS: Record<BrowserSource, string> = {
  Chrome: '🌐',
  Edge: '🔷',
  Brave: '🦁',
  Firefox: '🦊',
  Safari: '🧭',
  Other: '📎',
};

export const TOPIC_COLORS: Record<TopicCategory, string> = {
  AI: '#6c47ff',
  Development: '#0891b2',
  Design: '#d946ef',
  Learning: '#059669',
  Finance: '#16a34a',
  News: '#dc2626',
  Social: '#2563eb',
  Tools: '#d97706',
  Entertainment: '#ea580c',
  Science: '#7c3aed',
  Health: '#e11d48',
  Business: '#0f766e',
  Productivity: '#4338ca',
  Security: '#374151',
  Other: '#9491a8',
};

export const TOPIC_BG_COLORS: Record<TopicCategory, string> = {
  AI: '#ede9ff',
  Development: '#e0f2fe',
  Design: '#fae8ff',
  Learning: '#d1fae5',
  Finance: '#dcfce7',
  News: '#fee2e2',
  Social: '#dbeafe',
  Tools: '#fef3c7',
  Entertainment: '#ffedd5',
  Science: '#ede9fe',
  Health: '#ffe4e6',
  Business: '#ccfbf1',
  Productivity: '#e0e7ff',
  Security: '#f3f4f6',
  Other: '#f5f4f0',
};

export const TOPIC_EMOJIS: Record<TopicCategory, string> = {
  AI: '🤖',
  Development: '💻',
  Design: '🎨',
  Learning: '📚',
  Finance: '💰',
  News: '📰',
  Social: '💬',
  Tools: '🔧',
  Entertainment: '🎬',
  Science: '🔬',
  Health: '❤️',
  Business: '📊',
  Productivity: '⚡',
  Security: '🔒',
  Other: '📎',
};

export const getFaviconUrl = (url: string, size = 32): string => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return '';
  }
};

export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '…';
};
