import React, { useEffect } from 'react';
import AppProviders from './app/AppProviders';
import AppTheme from './app/AppTheme';
import AppRouter from './app/AppRouter';
import { useAppDispatch } from './store/hooks';
import { initializeAuthThunk } from './store/authSlice';

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuthThunk());
  }, [dispatch]);

  return (
    <AppTheme>
      <AppRouter />
    </AppTheme>
  );
};

const App = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;