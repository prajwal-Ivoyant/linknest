import React, { useMemo, useEffect } from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAppSelector } from '../store/hooks';

const AppTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentTheme = useAppSelector((s) => s.ui.theme);
  const isDark = currentTheme === 'dark';

   useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

 // Memoize so ConfigProvider only re-renders when theme actually changes
  const antdTheme = useMemo(() => ({
    // This is the key — darkAlgorithm makes ALL Ant Design components
    // (Modal, Select, Dropdown, Input, Table, etc.) switch to dark automatically
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

    token: {
      // Primary color
      colorPrimary:          isDark ? '#7c5cff' : '#6c47ff',
      colorPrimaryHover:     isDark ? '#9b7aff' : '#8b6aff',

      // Backgrounds — maps to our CSS vars
      colorBgBase:           isDark ? '#100f18' : '#f5f4f0',
      colorBgContainer:      isDark ? '#1c1a2e' : '#ffffff',
      colorBgElevated:       isDark ? '#242038' : '#ffffff',
      colorBgLayout:         isDark ? '#100f18' : '#f5f4f0',
      colorBgSpotlight:      isDark ? '#2e2a45' : '#ffffff',

      // Text
      colorText:             isDark ? '#edeaff' : '#1a1825',
      colorTextSecondary:    isDark ? '#a39cc0' : '#4a4760',
      colorTextTertiary:     isDark ? '#6b6688' : '#9491a8',
      colorTextPlaceholder:  isDark ? '#4a4668' : '#bbb8cc',
      colorTextDisabled:     isDark ? '#4a4668' : '#bbb8cc',
      colorTextHeading:      isDark ? '#edeaff' : '#1a1825',
      colorTextLabel:        isDark ? '#a39cc0' : '#4a4760',

      // Borders
      colorBorder:           isDark ? '#2e2a45' : '#e8e5f0',
      colorBorderSecondary:  isDark ? '#3d3860' : '#ece9f5',
      colorSplit:            isDark ? '#2e2a45' : '#e8e5f0',

      // Fill (used for hover states, tags, etc.)
      colorFill:             isDark ? '#2e2a45' : '#f5f4f0',
      colorFillSecondary:    isDark ? '#241f38' : '#ece9f5',
      colorFillTertiary:     isDark ? '#1c1a2e' : '#f5f4f0',
      colorFillQuaternary:   isDark ? '#1a1828' : '#faf9ff',

      // Typography
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,

      // Shape
      borderRadius:    8,
      borderRadiusLG: 10,
      borderRadiusSM:  6,
      borderRadiusXS:  4,

      // Shadow
      boxShadow:       isDark
        ? '0 2px 16px rgba(0,0,0,0.5)'
        : '0 2px 12px rgba(108,71,255,0.08)',
      boxShadowSecondary: isDark
        ? '0 6px 24px rgba(0,0,0,0.4)'
        : '0 6px 20px rgba(108,71,255,0.12)',

      // Motion
      motionDurationMid: '0.18s',
    },

    // Component-level overrides — these fine-tune specific components
    // without breaking the dark algorithm
    components: {
      Layout: {
        siderBg:        isDark ? '#1c1a2e' : '#ffffff',
        bodyBg:         isDark ? '#100f18' : '#f5f4f0',
        headerBg:       isDark ? '#1c1a2e' : '#ffffff',
        footerBg:       isDark ? '#1c1a2e' : '#ffffff',
        triggerBg:      isDark ? '#242038' : '#f5f4f0',
        triggerColor:   isDark ? '#a39cc0' : '#4a4760',
      },
      Menu: {
        itemBg:             'transparent',
        subMenuItemBg:      'transparent',
        itemSelectedBg:     isDark ? 'rgba(124,92,255,0.15)' : '#ede9ff',
        itemSelectedColor:  isDark ? '#9b7aff' : '#6c47ff',
        itemHoverBg:        isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        itemHoverColor:     isDark ? '#edeaff' : '#1a1825',
        itemColor:          isDark ? '#a39cc0' : '#4a4760',
      },
      Button: {
        defaultBg:          isDark ? '#1c1a2e' : '#ffffff',
        defaultBorderColor: isDark ? '#2e2a45' : '#e8e5f0',
        defaultColor:       isDark ? '#a39cc0' : '#4a4760',
        defaultHoverBg:     isDark ? '#242038' : '#f5f4f0',
        defaultHoverBorderColor: isDark ? '#3d3860' : '#d4d0e8',
        defaultHoverColor:  isDark ? '#edeaff' : '#1a1825',
        textHoverBg:        isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      },
      Input: {
        colorBgContainer:   isDark ? '#1c1a2e' : '#ffffff',
        colorBorder:        isDark ? '#2e2a45' : '#e8e5f0',
        activeBorderColor:  isDark ? '#7c5cff' : '#6c47ff',
        hoverBorderColor:   isDark ? '#3d3860' : '#d4d0e8',
        activeShadow:       isDark
          ? '0 0 0 2px rgba(124,92,255,0.2)'
          : '0 0 0 2px rgba(108,71,255,0.12)',
      },
      Select: {
        colorBgContainer:      isDark ? '#1c1a2e' : '#ffffff',
        colorBorder:           isDark ? '#2e2a45' : '#e8e5f0',
        optionSelectedBg:      isDark ? 'rgba(124,92,255,0.2)' : '#ede9ff',
        optionSelectedColor:   isDark ? '#9b7aff' : '#6c47ff',
        optionActiveBg:        isDark ? 'rgba(255,255,255,0.05)' : '#f5f4f0',
      },
      Modal: {
        contentBg:   isDark ? '#1c1a2e' : '#ffffff',
        headerBg:    isDark ? '#1c1a2e' : '#ffffff',
        footerBg:    isDark ? '#1c1a2e' : '#ffffff',
        titleColor:  isDark ? '#edeaff' : '#1a1825',
      },
      Drawer: {
        colorBgElevated: isDark ? '#1c1a2e' : '#ffffff',
      },
      Card: {
        colorBgContainer: isDark ? '#1c1a2e' : '#ffffff',
        colorBorderSecondary: isDark ? '#2e2a45' : '#e8e5f0',
      },
      Table: {
        colorBgContainer:     isDark ? '#1c1a2e' : '#ffffff',
        headerBg:             isDark ? '#242038' : '#f5f4f0',
        rowHoverBg:           isDark ? '#242038' : '#faf9ff',
        borderColor:          isDark ? '#2e2a45' : '#e8e5f0',
      },
      Tabs: {
        inkBarColor:      isDark ? '#7c5cff' : '#6c47ff',
        itemActiveColor:  isDark ? '#9b7aff' : '#6c47ff',
        itemSelectedColor: isDark ? '#9b7aff' : '#6c47ff',
        itemHoverColor:   isDark ? '#edeaff' : '#1a1825',
        itemColor:        isDark ? '#6b6688' : '#9491a8',
        cardBg:           isDark ? '#242038' : '#f5f4f0',
      },
      Dropdown: {
        colorBgElevated: isDark ? '#242038' : '#ffffff',
      },
      Tooltip: {
        colorBgSpotlight: isDark ? '#2e2a45' : '#1a1825',
        colorTextLightSolid: isDark ? '#edeaff' : '#ffffff',
      },
      Tag: {
        defaultBg:    isDark ? '#2e2a45' : '#f5f4f0',
        defaultColor: isDark ? '#a39cc0' : '#4a4760',
      },
      Divider: {
        colorSplit: isDark ? '#2e2a45' : '#e8e5f0',
      },
      Pagination: {
        itemActiveBg: isDark ? 'rgba(124,92,255,0.2)' : '#ede9ff',
      },
      Upload: {
        colorFillAlter: isDark ? '#1c1a2e' : '#faf9ff',
        colorBorder:    isDark ? '#2e2a45' : '#e8e5f0',
      },
      Switch: {
        colorPrimary:      isDark ? '#7c5cff' : '#6c47ff',
        colorPrimaryHover: isDark ? '#9b7aff' : '#8b6aff',
      },
      Alert: {
        colorInfoBg:    isDark ? 'rgba(124,92,255,0.15)' : '#ede9ff',
        colorInfoBorder: isDark ? 'rgba(124,92,255,0.25)' : '#d4c8ff',
      },
      Checkbox: {
        colorPrimary:      isDark ? '#7c5cff' : '#6c47ff',
        colorPrimaryHover: isDark ? '#9b7aff' : '#8b6aff',
        colorBgContainer:  isDark ? '#1c1a2e' : '#ffffff',
        colorBorder:       isDark ? '#3d3860' : '#d4d0e8',
      },
      Avatar: {
        colorBgBase: isDark ? '#2e2a45' : '#f5f4f0',
      },
      Badge: {
        colorBgBase: isDark ? '#2e2a45' : '#f5f4f0',
      },
      Progress: {
        colorInfo: isDark ? '#7c5cff' : '#6c47ff',
      },
      Skeleton: {
        colorFill:          isDark ? '#2e2a45' : '#e8e5f0',
        colorFillContent:   isDark ? '#1c1a2e' : '#f5f4f0',
      },
      Form: {
        labelColor: isDark ? '#a39cc0' : '#4a4760',
      },
    },
  }), [isDark]);

  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        {children}
      </AntApp>
    </ConfigProvider>
  );
};

export default AppTheme;