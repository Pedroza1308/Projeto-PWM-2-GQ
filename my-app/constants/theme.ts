/**
 * Design System - Modern color palette and typography
 * Supports light and dark modes with enhanced visual hierarchy
 */

import { Platform } from 'react-native';

// Modern color palette with better contrast and accessibility
const tintColorLight = '#FF6B35'; // Updated to vibrant orange
const tintColorDark = '#4DABF7';  // Softer blue for dark mode

export const Colors = {
  light: {
    // Core colors
    text: {
      primary: '#1A1A1A',
      secondary: '#495057',
      tertiary: '#6C757D',
      inverse: '#FFFFFF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F1F3F5',
      card: '#FFFFFF',
    },
    tint: tintColorLight,
    
    // UI elements
    icon: {
      primary: '#495057',
      secondary: '#6C757D',
      accent: tintColorLight,
    },
    tabIconDefault: '#ADB5BD',
    tabIconSelected: tintColorLight,
    
    // Borders and separators
    border: {
      primary: '#E9ECEF',
      secondary: '#F1F3F5',
      accent: tintColorLight,
    },
    
    // Semantic colors
    success: '#37B24D',
    warning: '#F59F00',
    error: '#FA5252',
    info: '#339AF0',
    
    // States
    pressed: '#F8F9FA',
    disabled: '#CED4DA',
    
    // Modern accents
    accent: {
      primary: '#FF6B35',
      secondary: '#339AF0',
      tertiary: '#37B24D',
    }
  },
  dark: {
    // Core colors
    text: {
      primary: '#F8F9FA',
      secondary: '#E9ECEF',
      tertiary: '#ADB5BD',
      inverse: '#1A1A1A',
    },
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D',
      card: '#1E1E1E',
    },
    tint: tintColorDark,
    
   
    icon: {
      primary: '#E9ECEF',
      secondary: '#ADB5BD',
      accent: tintColorDark,
    },
    tabIconDefault: '#6C757D',
    tabIconSelected: tintColorDark,
    
    
    border: {
      primary: '#2D2D2D',
      secondary: '#3D3D3D',
      accent: tintColorDark,
    },
    
    
    success: '#51CF66',
    warning: '#FFD43B',
    error: '#FF6B6B',
    info: '#4DABF7',
    
   
    pressed: '#2D2D2D',
    disabled: '#495057',
    
    // Modern accents
    accent: {
      primary: '#4DABF7',
      secondary: '#FFA94D',
      tertiary: '#51CF66',
    }
  },
};


export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
    display: 'system-ui', 
    heading: 'system-ui',
    body: 'system-ui',    
    caption: 'system-ui', 
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
    display: 'sans-serif-medium',
    heading: 'sans-serif-medium',
    body: 'sans-serif',
    caption: 'sans-serif',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: 'normal',
    heading: 'normal',
    body: 'normal',
    caption: 'normal',
  },
  web: {
    sans: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: "system-ui, -apple-system, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    heading: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    caption: "system-ui, -apple-system, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
  },
});


export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};


export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};


export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};


export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};


export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};


export const Theme = {
  colors: Colors,
  fonts: Fonts,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animation: Animation,
};

export default Theme;