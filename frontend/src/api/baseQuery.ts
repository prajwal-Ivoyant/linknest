import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { setTokens, clearAuth } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ─── Base query with Authorization header ─────────────────────────────────────
// fetchBaseQuery is RTK Query's built-in fetch wrapper.
// prepareHeaders runs before every request — attaches the access token.

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ??
      localStorage.getItem('accessToken');

    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// ─── Mutex — prevents parallel refresh storms ─────────────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const doRefresh = async (dispatch: (a: unknown) => void): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const { accessToken, refreshToken: newRefresh } = json.data;

    // Persist to localStorage + Redux
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', newRefresh);
    dispatch(setTokens({ accessToken, refreshToken: newRefresh }));

    return accessToken;
  } catch {
    return null;
  }
};

// ─── baseQueryWithReauth ──────────────────────────────────────────────────────
// Wraps rawBaseQuery:
//   1. Runs the original request
//   2. If 401 → attempts token refresh (deduped via mutex)
//   3. Retries the original request with the new token
//   4. If refresh fails → clears auth and redirects to /login

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const errorData = result.error.data as { code?: string } | undefined;

    if (errorData?.code === 'TOKEN_EXPIRED') {
      // Deduplicate: if a refresh is already in flight, wait for it
      if (!isRefreshing) {
        isRefreshing     = true;
        refreshPromise   = doRefresh(api.dispatch).finally(() => {
          isRefreshing   = false;
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      if (newToken) {
        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — clear everything and redirect
        api.dispatch(clearAuth());
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }

  return result;
};