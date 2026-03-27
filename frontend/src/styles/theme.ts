import { theme as antdTheme, type ThemeConfig } from 'antd';

// ─── LinkNest Design Tokens ───────────────────────────────────────────────────
// Following Ant Design's 3-layer token system:
//   Seed Token  → the raw values you set (colorPrimary, borderRadius…)
//   Map Token   → derived automatically by the algorithm
//   Alias Token → semantic names mapped from Map Tokens
//
// We only set Seed Tokens here. The dark/default algorithm derives
// all 200+ Map & Alias tokens automatically from these seeds.

const BRAND = {
  primary:     '#6c47ff',
  primaryDark: '#7c5cff',   // slightly lighter for dark mode contrast
};

// Shared seed tokens (same in both modes)
const sharedToken: ThemeConfig['token'] = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  colorPrimary:  BRAND.primary,
  colorLink:     BRAND.primary,
  colorLinkHover: '#8b6aff',

  // ── Typography ────────────────────────────────────────────────────────────
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize:   14,
  fontSizeLG: 16,
  lineHeight: 1.6,

  // ── Shape ─────────────────────────────────────────────────────────────────
  borderRadius:   8,
  borderRadiusLG: 12,
  borderRadiusSM: 6,
  borderRadiusXS: 4,

  // ── Motion ────────────────────────────────────────────────────────────────
  motionDurationMid:  '0.18s',
  motionDurationFast: '0.12s',
  motionDurationSlow: '0.25s',
  motionEaseInOut:    'cubic-bezier(0.4, 0, 0.2, 1)',

  // ── Size ──────────────────────────────────────────────────────────────────
  controlHeight:   36,
  controlHeightLG: 44,
  controlHeightSM: 28,

  // ── Z-index ───────────────────────────────────────────────────────────────
  zIndexPopupBase: 1000,
};

// ─── Component-level overrides ────────────────────────────────────────────────
// These fine-tune individual components without touching global tokens.
// Stays the same in both modes — algorithm handles color variance.

const components: ThemeConfig['components'] = {
  Button: {
    primaryShadow:    '0 2px 8px rgba(108, 71, 255, 0.25)',
    defaultShadow:    'none',
    fontWeight:       600,
    borderRadius:     8,
    borderRadiusLG:   10,
    paddingInline:    20,
    paddingInlineLG:  28,
  },
  Input: {
    borderRadius:   8,
    borderRadiusLG: 10,
    paddingInline:  12,
  },
  Select: {
    borderRadius:   8,
    borderRadiusLG: 10,
  },
  Modal: {
    borderRadiusLG: 16,
    paddingMD:      32,
    paddingContentHorizontalLG: 32,
  },
  Card: {
    borderRadiusLG: 12,
    paddingLG:      20,
  },
  Tag: {
    borderRadiusSM:  20,   // pill shape
    fontSizeSM:      11,
    fontWeightStrong: 600,
  },
  Table: {
    borderRadius:    10,
    headerBorderRadius: 10,
  },
  Tabs: {
    inkBarColor:       BRAND.primary,
    itemActiveColor:   BRAND.primary,
    itemSelectedColor: BRAND.primary,
  },
  Steps: {
    iconSize:           32,
    customIconSize:     32,
    titleLineHeight:    32,
  },
  Badge: {
    borderRadiusSM: 20,
  },
  Divider: {
    marginLG: 16,
    margin:   12,
  },
  Upload: {
    borderRadius: 10,
  },
  Checkbox: {
    borderRadiusSM: 4,
  },
  Switch: {
    handleSize: 18,
  },
  FloatButton: {
    borderRadius: 50,
  },
  Notification: {
    borderRadiusLG: 12,
    width:          380,
  },
  Message: {
    borderRadius: 10,
  },
};

// ─── Light Theme ──────────────────────────────────────────────────────────────

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    ...sharedToken,
    colorPrimary: BRAND.primary,

    // Backgrounds
    colorBgBase:       '#f5f4f0',
    colorBgContainer:  '#ffffff',
    colorBgElevated:   '#ffffff',
    colorBgLayout:     '#f5f4f0',
    colorBgSpotlight:  '#ffffff',
    colorBgMask:       'rgba(0, 0, 0, 0.45)',

    // Text — set the base and let algorithm derive secondary/tertiary
    colorTextBase:     '#1a1825',

    // Border
    colorBorder:        '#e8e5f0',
    colorBorderSecondary: '#ece9f5',

    // Fill (hover backgrounds, skeletons, etc.)
    colorFill:          '#f5f4f0',
    colorFillSecondary: '#ece9f5',
    colorFillTertiary:  '#f5f4f0',
    colorFillQuaternary:'#faf9ff',

    // Shadows
    boxShadow:          '0 2px 12px rgba(108,71,255,0.08)',
    boxShadowSecondary: '0 6px 20px rgba(108,71,255,0.12)',
    boxShadowTertiary:  '0 1px 3px rgba(26,24,37,0.06)',
  },
  components,
};

// ─── Dark Theme ───────────────────────────────────────────────────────────────

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...sharedToken,
    colorPrimary: BRAND.primaryDark,

    // Backgrounds
    colorBgBase:       '#100f18',
    colorBgContainer:  '#1c1a2e',
    colorBgElevated:   '#242038',
    colorBgLayout:     '#100f18',
    colorBgSpotlight:  '#2e2a45',
    colorBgMask:       'rgba(0, 0, 0, 0.65)',

    // Text
    colorTextBase:     '#edeaff',

    // Border
    colorBorder:         '#2e2a45',
    colorBorderSecondary:'#3d3860',

    // Fill
    colorFill:          '#2e2a45',
    colorFillSecondary: '#241f38',
    colorFillTertiary:  '#1c1a2e',
    colorFillQuaternary:'#1a1828',

    // Shadows — stronger in dark mode since no natural light
    boxShadow:          '0 2px 16px rgba(0,0,0,0.5)',
    boxShadowSecondary: '0 6px 24px rgba(0,0,0,0.4)',
    boxShadowTertiary:  '0 1px 4px rgba(0,0,0,0.3)',
  },
  components,
};