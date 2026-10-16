/**
 * Color palette for Notwo app
 * Based on Material Design 3 color system
 */

export const colors = {
  // Primary colors
  primary: '#C2652A',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E08850',
  onPrimaryContainer: '#FBE8D8',

  // Secondary colors
  secondary: '#78706A',
  onSecondary: '#FFFFFF',

  // Tertiary colors
  tertiary: '#8C3C3C',
  onTertiary: '#FFFFFF',

  // Background & Surface
  background: '#FAF5EE',
  onBackground: '#3A302A',
  surface: '#FAF5EE',
  onSurface: '#3A302A',
  onSurfaceVariant: '#605850',

  // Surface containers
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F6F0E8',
  surfaceContainer: '#F2ECE4',
  surfaceContainerHigh: '#ECE6DC',
  surfaceContainerHighest: '#E6E0D6',

  // Outline
  outline: '#9A9088',
  outlineVariant: '#D8D0C8',

  // Accent colors
  accentBadge: '#C2652A',
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
  info: '#3B82F6',
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
  card: colors.surfaceContainerLow,
  border: colors.outlineVariant,
};

export const darkTheme = {
  text: colors.onSurface,
  background: colors.background,
  tint: colors.primary,
  icon: colors.onSurfaceVariant,
  tabIconDefault: colors.secondary,
  tabIconSelected: colors.primary,
  card: colors.surfaceContainerLow,
  border: colors.outlineVariant,
};

export type ThemeColors = typeof lightTheme;
