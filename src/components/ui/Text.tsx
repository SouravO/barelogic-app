import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { textStyles, colors, TextStyle } from '@/theme';

interface TextProps extends RNTextProps {
  variant?: TextStyle;
  color?: keyof typeof colors;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        textStyles[variant],
        color && { color: colors[color] },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
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
