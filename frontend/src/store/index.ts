import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
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

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui:   persistReducer(uiPersistConfig,   uiReducer),
  // RTK Query cache reducer — NOT persisted (always fresh)
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
    })
    // RTK Query middleware — handles cache lifetime, polling, invalidation
    .concat(authApiSlice.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store, {}, () => {
  const theme = store.getState().ui.theme ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;