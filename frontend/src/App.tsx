import React, { useEffect } from 'react';
import AppProviders from './app/AppProviders';
import AppTheme from './app/AppTheme';
import AppRouter from './app/AppRouter';
import { useAppDispatch } from './store/hooks';
import { useGetMeQuery } from './store/authapiSlice';

const AppContent = () => {
  const dispatch = useAppDispatch();

 const { isLoading } = useGetMeQuery(undefined, {
  skip: !localStorage.getItem('accessToken'),
});

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