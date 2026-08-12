/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const SaharaTheme = {
  primary: '#C2652A',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E08850',
  onPrimaryContainer: '#FBE8D8',
  background: '#FAF5EE',
  surface: '#FAF5EE',
  surfaceContainerLow: '#F6F0E8',
  surfaceContainer: '#F2ECE4',
  surfaceContainerHigh: '#ECE6DC',
  surfaceContainerHighest: '#E6E0D6',
  surfaceContainerLowest: '#FFFFFF',
  onBackground: '#3A302A',
  onSurface: '#3A302A',
  onSurfaceVariant: '#605850',
  secondary: '#78706A',
  outline: '#9A9088',
  outlineVariant: '#D8D0C8',
  tertiary: '#8C3C3C',
  accentBadge: '#C2652A',
  accentGreen: '#10B981',
};

export const Colors = {
  light: {
    text: SaharaTheme.onSurface,
    background: SaharaTheme.background,
    tint: SaharaTheme.primary,
    icon: SaharaTheme.onSurfaceVariant,
    tabIconDefault: SaharaTheme.secondary,
    tabIconSelected: SaharaTheme.primary,
    card: SaharaTheme.surfaceContainerLow,
    border: SaharaTheme.outlineVariant,
  },
  dark: {
    text: SaharaTheme.onSurface,
    background: SaharaTheme.background,
    tint: SaharaTheme.primary,
    icon: SaharaTheme.onSurfaceVariant,
    tabIconDefault: SaharaTheme.secondary,
    tabIconSelected: SaharaTheme.primary,
    card: SaharaTheme.surfaceContainerLow,
    border: SaharaTheme.outlineVariant,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'EB Garamond', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "monospace",
  },
});

