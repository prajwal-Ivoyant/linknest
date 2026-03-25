import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { type AuthState } from './authSlice';
import uiReducer, { type UIState } from './uiSlice';
import { authApiSlice } from './authapiSlice';

// ─── Persist configs ──────────────────────────────────────────────────────────

const authPersistConfig = {
  key: 'linknest-auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

const uiPersistConfig = {
  key: 'linknest-ui',
  storage,
  whitelist: ['theme'],
};

// ─── Root reducer ─────────────────────────────────────────────────────────────
// Explicitly cast persisted reducers back to their original state types so
// TypeScript sees AuthState / UIState instead of PersistPartial<...>.

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer) as unknown as (
    state: AuthState | undefined,
    action: { type: string }
  ) => AuthState,

  ui: persistReducer(uiPersistConfig, uiReducer) as unknown as (
    state: UIState | undefined,
    action: { type: string }
  ) => UIState,

  // RTK Query cache — never persisted, always fresh on load
  [authApiSlice.reducerPath]: authApiSlice.reducer,
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApiSlice.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store, {}, () => {
  // Apply persisted theme to <html> immediately after rehydration
  const theme = store.getState().ui.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
});

// ─── Types ────────────────────────────────────────────────────────────────────
// RootState now resolves to { auth: AuthState, ui: UIState, authApi: ... }
// No more PersistPartial — all fields (accessToken, user, etc.) are visible.

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;