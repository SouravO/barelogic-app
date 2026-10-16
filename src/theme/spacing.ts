/**
 * Spacing scale for consistent layout
 * Based on 4px base unit
 */

export const spacing = {
  // Base units
  unit: 4,
  
  // Spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Specific use cases
  stackXs: 4,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
  stackXl: 32,

  // Margins & Padding
  marginMobile: 16,
  marginDesktop: 24,
  paddingMobile: 16,
  paddingDesktop: 24,

  // Gaps
  gutter: 16,
  gutterLarge: 24,

  // Border radius
  radiusXs: 4,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,

  // Container
  containerMaxWidth: 1280,
} as const;

export type Spacing = typeof spacing;
