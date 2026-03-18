export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    defaultView: 'grid' | 'list';
    theme: 'light' | 'dark';
  };
  createdAt: string;
}

export interface Bookmark {
  _id: string;
  user: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  domain?: string;
  browserSource: BrowserSource;
  topicCategory: TopicCategory;
  aiCategorized: boolean;
  aiConfidence: number;
  manuallyEdited: boolean;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  visitCount: number;
  lastVisited?: string;
  addedAt: string;
  createdAt: string;
}

export type BrowserSource = 'Chrome' | 'Edge' | 'Brave' | 'Firefox' | 'Safari' | 'Other';
export type TopicCategory =
  | 'AI'
  | 'Development'
  | 'Design'
  | 'Learning'
  | 'Finance'
  | 'News'
  | 'Social'
  | 'Tools'
  | 'Entertainment'
  | 'Science'
  | 'Health'
  | 'Business'
  | 'Productivity'
  | 'Security'
  | 'Other';

export const BROWSER_SOURCES: BrowserSource[] = ['Chrome', 'Edge', 'Brave', 'Firefox', 'Safari', 'Other'];
export const TOPIC_CATEGORIES: TopicCategory[] = [
  'AI', 'Development', 'Design', 'Learning', 'Finance',
  'News', 'Social', 'Tools', 'Entertainment', 'Science',
  'Health', 'Business', 'Productivity', 'Security', 'Other',
];

export interface BookmarkFilters {
  browserSource?: BrowserSource | 'all';
  topicCategory?: TopicCategory | 'all';
  isFavorite?: boolean;
  isArchived?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  tags?: string;
}

export interface PaginatedBookmarks {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  total: number;
  favorites: number;
  byBrowser: { name: string; count: number }[];
  byTopic: { name: string; count: number }[];
  recentlyAdded: Bookmark[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
