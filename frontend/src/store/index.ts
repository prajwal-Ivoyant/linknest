import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer,      { type AuthState } from './authSlice';
import uiReducer,        { type UIState   } from './uiSlice';
import { authApiSlice }                     from './authapiSlice';
import { bookmarksApiSlice }                from './bookmarksApiSlice';

// ─── Persist configs ──────────────────────────────────────────────────────────

const authPersistConfig = {
  key:       'linknest-auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

const uiPersistConfig = {
  key:       'linknest-ui',
  storage,
  whitelist: ['theme'],
};

// ─── Root reducer ─────────────────────────────────────────────────────────────
// Cast persisted reducers back to their original types so TypeScript resolves
// s.auth.accessToken / s.auth.user without PersistPartial interference.

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer) as unknown as (
    state:  AuthState | undefined,
    action: { type: string }
  ) => AuthState,

  

  ui: persistReducer(uiPersistConfig, uiReducer) as unknown as (
    state:  UIState | undefined,
    action: { type: string }
  ) => UIState,

  // RTK Query reducers — never persisted, always fresh
  [authApiSlice.reducerPath]:      authApiSlice.reducer,
  [bookmarksApiSlice.reducerPath]: bookmarksApiSlice.reducer,
});



// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApiSlice.middleware)
      .concat(bookmarksApiSlice.middleware),   // handles cache TTL, polling, invalidation
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store, {}, () => {
  const theme = store.getState().ui.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;