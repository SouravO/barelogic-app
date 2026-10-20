import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { colors } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
  padding?: boolean;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  safeArea = true,
  edges = ['top', 'bottom'],
  backgroundColor = colors.background,
  padding = true,
  style,
}) => {
  // backgroundColor / caller `style` are runtime values, so they ride on `style`;
  // layout (flex grow + horizontal padding) is expressed as className.
  const contentStyle: ViewStyle = {
    backgroundColor,
    ...style,
  };
  const contentClass = padding ? 'grow px-4' : 'grow';

  const Container = safeArea ? SafeAreaView : View;
  const containerProps = safeArea ? { edges } : {};

  return (
    <Container
      style={[styles.container, { backgroundColor }]}
      {...containerProps}
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClass}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <Box className={contentClass} style={contentStyle}>
          {children}
        </Box>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
