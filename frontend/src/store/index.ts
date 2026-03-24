import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

// ─── Persist configs ──────────────────────────────────────────────────────────

const authPersistConfig = {
  key: 'linknest-auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'],
};

// Persist view + theme preference only (not filters/modals/selection)
const uiPersistConfig = {
  key: 'linknest-ui',
  storage,
  whitelist: ['view', 'theme'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store, {}, () => {
  // After rehydration, apply persisted theme to document
  const theme = store.getState().ui.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;