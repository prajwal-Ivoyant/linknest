import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import { authApiSlice } from './authapiSlice';

// ─── State ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manually set tokens (e.g. after axios interceptor refreshes them)
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken  = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken',  action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    // Clear all auth state (called on logout or token expiry)
    clearAuth(state) {
      state.user            = null;
      state.accessToken     = null;
      state.refreshToken    = null;
      state.isAuthenticated = false;
      state.error           = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    clearError(state) {
      state.error = null;
    },
  },

  // ── RTK Query lifecycle → sync into local auth state ─────────────────────
  extraReducers: (builder) => {

    // ── Login ──
    builder
      .addMatcher(authApiSlice.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading       = false;
        state.user            = action.payload.data.user;
        state.accessToken     = action.payload.data.accessToken;
        state.refreshToken    = action.payload.data.refreshToken;
        state.isAuthenticated = true;
      })
      .addMatcher(authApiSlice.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { data?: { message?: string } })?.data?.message
          ?? action.error.message
          ?? 'Login failed';
      });

    // ── Register ──
    builder
      .addMatcher(authApiSlice.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addMatcher(authApiSlice.endpoints.register.matchFulfilled, (state, action) => {
        state.isLoading       = false;
        state.user            = action.payload.data.user;
        state.accessToken     = action.payload.data.accessToken;
        state.refreshToken    = action.payload.data.refreshToken;
        state.isAuthenticated = true;
      })
      .addMatcher(authApiSlice.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as { data?: { message?: string } })?.data?.message
          ?? action.error.message
          ?? 'Registration failed';
      });

    // ── Logout ──
    builder.addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
      state.user            = null;
      state.accessToken     = null;
      state.refreshToken    = null;
      state.isAuthenticated = false;
    });

    // ── Get Me (app initialization) ──
    builder
      .addMatcher(authApiSlice.endpoints.getMe.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
        state.isLoading       = false;
        state.user            = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addMatcher(authApiSlice.endpoints.getMe.matchRejected, (state) => {
        state.isLoading       = false;
        state.isAuthenticated = false;
        state.user            = null;
        state.accessToken     = null;
        state.refreshToken    = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });

    // ── Refresh Token ──
    builder.addMatcher(authApiSlice.endpoints.refreshToken.matchFulfilled, (state, action) => {
      state.accessToken  = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
    });

    // ── Update Profile ──
    builder.addMatcher(authApiSlice.endpoints.updateProfile.matchFulfilled, (state, action) => {
      state.user = action.payload.data.user;
    });
  },
});

export const { setTokens, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;