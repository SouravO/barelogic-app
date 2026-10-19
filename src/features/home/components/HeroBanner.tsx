import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

interface HeroBannerProps {
  onStartScan?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStartScan }) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text variant="labelSmall" style={styles.label}>
          New Launch
        </Text>
      </View>

      <Text variant="headlineLarge" style={styles.title}>
        Manuka Rich{'\n'}Cream
      </Text>

      <Text variant="bodyMedium" style={styles.description}>
        Deep hydration.{'\n'}Stronger skin barrier.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onStartScan} activeOpacity={0.9}>
        <Text variant="labelLarge" style={styles.buttonText}>
          Shop Now
        </Text>
        <Ionicons name="arrow-forward" size={16} color={colors.onSurface} />
      </TouchableOpacity>

      {/* Product Image - positioned on right */}
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/serum_01.png')}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.heroBackground,
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
  },
  labelContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.onPrimary,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  title: {
    color: colors.onPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
    maxWidth: '60%',
  },
  description: {
    color: colors.onPrimary,
    opacity: 0.9,
    marginBottom: spacing.lg,
    maxWidth: '55%',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  buttonText: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -80 }],
    width: 160,
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    gap: spacing.xs,
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.onPrimary,
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
    width: 20,
  },
});
