import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { store, persistor } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuthThunk } from './store/authSlice';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const antTheme = {
  token: {
    colorPrimary: '#6c47ff',
    colorBgBase: '#f5f4f0',
    colorBgContainer: '#ffffff',
    colorBorder: '#e8e5f0',
    colorText: '#1a1825',
    colorTextSecondary: '#4a4760',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: 8,
    borderRadiusLG: 10,
    boxShadow: '0 2px 12px rgba(108, 71, 255, 0.08)',
  },
};

// ─── Protected Route ───────────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// ─── App Bootstrap — fires initializeAuth on mount ────────────────────────
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* <ProtectedRoute><Dashboard /></ProtectedRoute> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <Provider store={store}>
    {/* <PersistGate
      loading={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4f0' }}>
          <Spin size="large" />
        </div>
      }
      persistor={persistor}
    > */}
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <AntApp>
          <AppContent />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
    {/* </PersistGate> */}
  </Provider>
);

export default App;
