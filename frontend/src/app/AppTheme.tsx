import React, { useMemo, useEffect } from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAppSelector } from '../store/hooks';
import { darkTheme, lightTheme } from '../styles/theme';

const AppTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentTheme = useAppSelector((s) => s.ui.theme);
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const antdTheme = isDark ? darkTheme : lightTheme;

  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        {children}
      </AntApp>
    </ConfigProvider>
  );
};

export default AppTheme;