/**
 * api/client.ts
 *
 * Axios instance used ONLY by authApi (login, register, logout, me).
 * All bookmark endpoints use RTK Query (bookmarksApiSlice) with fetchBaseQuery.
 *
 * The token refresh logic for RTK Query lives in api/baseQuery.ts.
 * This client handles auth-specific requests where we still need axios.
 */

import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach access token to every auth request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth routes don't need token refresh (they ARE the auth routes),
// so no response interceptor needed here.

export default apiClient;