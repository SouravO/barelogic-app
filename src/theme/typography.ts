/**
 * Typography system for Notwo app
 * Defines font families, sizes, weights, and line heights
 */

import { Platform } from 'react-native';

/**
 * Font families by platform
 */
export const fontFamily = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'EB Garamond', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', system-ui, sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
});

/**
 * Font sizes
 */
export const fontSize = {
  // Display sizes (large headings)
  displayLg: 57,
  displayMd: 45,
  displaySm: 36,

  // Headline sizes
  headlineLg: 32,
  headlineMd: 28,
  headlineSm: 24,

  // Title sizes
  titleLg: 22,
  titleMd: 16,
  titleSm: 14,

  // Label sizes
  labelLg: 14,
  labelMd: 12,
  labelSm: 11,

  // Body sizes
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,

  // Caption
  caption: 11,
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

/**
 * Line heights (relative to font size)
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

/**
 * Text style presets
 */
export const textStyles = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.displayLg,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.displayLg * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displayMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.displayMd,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.displayMd * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Headline styles
  headlineLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.headlineLg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.headlineLg * lineHeight.normal,
  },
  headlineMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.headlineMd,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.headlineMd * lineHeight.normal,
  },
  headlineSmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.headlineSm,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.headlineSm * lineHeight.normal,
  },

  // Title styles
  titleLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.titleLg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.titleLg * lineHeight.normal,
  },
  titleMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.titleMd,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.titleMd * lineHeight.normal,
  },

  // Body styles
  bodyLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.bodyLg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.bodyLg * lineHeight.normal,
  },
  bodyMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.bodyMd * lineHeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.bodySm * lineHeight.normal,
  },

  // Label styles
  labelLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.labelLg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.labelLg * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.labelMd,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.labelMd * lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.labelSm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.labelSm * lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  // Caption
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.caption * lineHeight.normal,
  },
} as const;

export type TextStyle = keyof typeof textStyles;
