import apiClient from './client';
import type { BookmarkFilters, Bookmark } from '../types';

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  logout: (refreshToken?: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (data: Partial<{ name: string; preferences: object }>) =>
    apiClient.patch('/auth/me', data),
};

// ─── Bookmarks API ────────────────────────────────────────────────────────────

export const bookmarksApi = {
  list: (filters: BookmarkFilters = {}) => {
    const params: Record<string, string | number | boolean> = {};
    if (filters.browserSource && filters.browserSource !== 'all') params.browserSource = filters.browserSource;
    if (filters.topicCategory && filters.topicCategory !== 'all') params.topicCategory = filters.topicCategory;
    if (filters.isFavorite) params.isFavorite = true;
    if (filters.isArchived) params.isArchived = true;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.tags) params.tags = filters.tags;
    return apiClient.get('/bookmarks', { params });
  },

  // Kanban grouped endpoint
  grouped: (params: {
    by?: 'browserSource' | 'topicCategory';
    browserSource?: string;
    topicCategory?: string;
    limit?: number;
    isArchived?: boolean;
    search?: string;
  }) => apiClient.get('/bookmarks/grouped', { params }),

  stats: () => apiClient.get('/bookmarks/stats'),
  get: (id: string) => apiClient.get(`/bookmarks/${id}`),
  create: (data: Partial<Bookmark>) => apiClient.post('/bookmarks', data),
  update: (id: string, data: Partial<Bookmark>) => apiClient.patch(`/bookmarks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/bookmarks/${id}`),
  bulkDelete: (ids: string[]) => apiClient.delete('/bookmarks/bulk/delete', { data: { ids } }),

  importFile: (file: File, onProgress?: (pct: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/bookmarks/import/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    });
  },

  importUrl: (url: string, title?: string, browserSource?: string) =>
    apiClient.post('/bookmarks/import/url', { url, title, browserSource }),

  trackVisit: (id: string) => apiClient.post(`/bookmarks/${id}/visit`),
};