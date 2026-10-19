/**
 * Color palette for Notwo app
 * Modern blue-gray aesthetic with clean minimalist design
 */

export const colors = {
  // Primary colors - Cool blue-gray tones
  primary: '#5B7B8F',
  onPrimary: '#FFFFFF',
  primaryContainer: '#7A99AD',
  onPrimaryContainer: '#E8EFF3',

  // Secondary colors
  secondary: '#8FA3B0',
  onSecondary: '#FFFFFF',

  // Tertiary colors
  tertiary: '#6B8796',
  onTertiary: '#FFFFFF',

  // Background & Surface - Light cool grays
  background: '#F5F7F9',
  onBackground: '#1E2A35',
  surface: '#FFFFFF',
  onSurface: '#1E2A35',
  onSurfaceVariant: '#5B6B78',

  // Surface containers - Blue-gray shades
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#EDF1F4',
  surfaceContainer: '#E5EAF0',
  surfaceContainerHigh: '#D8E0E8',
  surfaceContainerHighest: '#CDD6DF',

  // Hero/Card backgrounds - Muted blue-gray
  heroBackground: '#6A8599',
  heroDark: '#5B7B8F',
  cardBackground: '#FFFFFF',

  // Outline
  outline: '#B8C5D0',
  outlineVariant: '#DDE5EC',

  // Accent colors
  accentBadge: '#5B7B8F',
  accentGreen: '#10B981',
  accentRed: '#DC2626',
  accentYellow: '#F59E0B',

  // Semantic colors
  error: '#DC2626',
  onError: '#FFFFFF',
  success: '#10B981',
  onSuccess: '#FFFFFF',
  warning: '#F59E0B',
  onWarning: '#FFFFFF',
  info: '#5B7B8F',
  onInfo: '#FFFFFF',
} as const;

/**
 * Theme variants for light and dark modes
 */
export const lightTheme = {
  text: colors.onSurface,
  background: colors.background,
  tint: colors.primary,
  icon: colors.onSurfaceVariant,
  tabIconDefault: colors.secondary,
  tabIconSelected: colors.primary,
  card: colors.cardBackground,
  border: colors.outlineVariant,
};

export const darkTheme = {
  text: colors.onSurface,
  background: colors.background,
  tint: colors.primary,
  icon: colors.onSurfaceVariant,
  tabIconDefault: colors.secondary,
  tabIconSelected: colors.primary,
  card: colors.cardBackground,
  border: colors.outlineVariant,
};

export type ThemeColors = typeof lightTheme;

// Legacy exports for backward compatibility
export const SaharaTheme = {
  primary: colors.primary,
  secondary: colors.secondary,
  background: colors.background,
  surface: colors.surface,
  onSurface: colors.onSurface,
  onSurfaceVariant: colors.onSurfaceVariant,
  surfaceContainerLow: colors.surfaceContainerLow,
  outline: colors.outline,
  outlineVariant: colors.outlineVariant,
};

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
};
