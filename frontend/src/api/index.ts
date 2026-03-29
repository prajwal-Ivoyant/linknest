/**
 * api/index.ts
 *
 * Only authApi remains here — it's used by authApiSlice (RTK Query)
 * which uses fetchBaseQuery internally, not axios.
 *
 * All bookmark API calls are now handled by bookmarksApiSlice
 * via useBookmarks.ts hooks — no manual axios calls needed.
 */

import apiClient from './client';

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