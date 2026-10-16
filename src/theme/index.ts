/**
 * Notwo App Theme
 * Centralized design system with colors, spacing, and typography
 */

import { colors, lightTheme, darkTheme } from './colors';
import { spacing } from './spacing';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textStyles } from './typography';

/**
 * Main theme object
 */
export const theme = {
  colors,
  spacing,
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textStyles,
  },
  variants: {
    light: lightTheme,
    dark: darkTheme,
  },
} as const;

/**
 * Legacy compatibility - export SaharaTheme for gradual migration
 * @deprecated Use `theme.colors` instead
 */
export const SaharaTheme = colors;

/**
 * Legacy compatibility - export Colors for gradual migration
 * @deprecated Use `theme.variants` instead
 */
export const Colors = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * Legacy compatibility - export Fonts for gradual migration
 * @deprecated Use `theme.typography.fontFamily` instead
 */
export const Fonts = fontFamily;

// Export individual modules
export * from './colors';
export * from './spacing';
export * from './typography';

// Type exports
export type Theme = typeof theme;
export type ThemeVariant = 'light' | 'dark';
