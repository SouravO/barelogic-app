import React from 'react';
import type { TextProps as RNTextProps } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { colors, TextStyle } from '@/theme';

type ColorKey = keyof typeof colors;

interface TextProps extends RNTextProps {
  variant?: TextStyle;
  color?: ColorKey;
  children: React.ReactNode;
}

// variant -> semantic typography tokens defined in global.css (`--text-*`).
// `text-inherit` undoes gluestack's `text-foreground` base so an uncolored Text
// still inherits from its parent, exactly as the StyleSheet version did.
const VARIANT_CLASS: Record<TextStyle, string> = {
  displayLarge: 'text-display-lg font-bold',
  displayMedium: 'text-display-md font-bold',
  headlineLarge: 'text-headline-lg font-semibold',
  headlineMedium: 'text-headline-md font-semibold',
  headlineSmall: 'text-headline-sm font-semibold',
  titleLarge: 'text-title-lg font-medium',
  titleMedium: 'text-title-md font-medium',
  bodyLarge: 'text-body-lg font-normal',
  bodyMedium: 'text-body-md font-normal',
  bodySmall: 'text-body-sm font-normal',
  labelLarge: 'text-label-lg font-medium uppercase',
  labelMedium: 'text-label-md font-medium uppercase',
  labelSmall: 'text-label-sm font-medium uppercase',
  caption: 'text-caption font-normal',
};

// color -> semantic color token. Keys with no exact token fall back to the
// theme value via `style` so no palette entry renders the wrong hue.
const COLOR_CLASS: Partial<Record<ColorKey, string>> = {
  primary: 'text-primary',
  onPrimary: 'text-primary-foreground',
  secondary: 'text-secondary',
  onSecondary: 'text-secondary-foreground',
  onBackground: 'text-foreground',
  onSurface: 'text-foreground',
  onSurfaceVariant: 'text-muted-foreground',
  heroBackground: 'text-hero',
  accentGreen: 'text-success',
  accentRed: 'text-destructive',
  accentYellow: 'text-warning',
  error: 'text-destructive',
  onError: 'text-destructive-foreground',
  success: 'text-success',
  onSuccess: 'text-success-foreground',
  warning: 'text-warning',
  onWarning: 'text-warning-foreground',
  info: 'text-info',
  onInfo: 'text-info-foreground',
};

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color,
  style,
  children,
  ...props
}) => {
  const colorClass = color ? COLOR_CLASS[color] : undefined;
  const fallbackColorStyle = color && !colorClass ? { color: colors[color] } : undefined;

  return (
    <GluestackText
      className={`${VARIANT_CLASS[variant]} ${colorClass ?? 'text-inherit'}`}
      style={fallbackColorStyle ? [fallbackColorStyle, style] : style}
      {...props}
    >
      {children}
    </GluestackText>
  );
};

// Convenience components for common text styles
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="displayLarge" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="displayMedium" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="headlineLarge" {...props} />
);

export const Heading4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="headlineMedium" {...props} />
);

export const Title: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="titleLarge" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyMedium" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="labelLarge" {...props} />
);
