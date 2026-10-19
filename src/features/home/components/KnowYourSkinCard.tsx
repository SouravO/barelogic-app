import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

interface KnowYourSkinCardProps {
  onStartScan?: () => void;
}

export const KnowYourSkinCard: React.FC<KnowYourSkinCardProps> = ({ onStartScan }) => {
  return (
    <View style={styles.container}>
      {/* Left Section - Text & CTA */}
      <View style={styles.leftSection}>
        <Text variant="headlineMedium" style={styles.title}>
          Know Your Skin
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Get a personalised{'\n'}skin analysis in seconds.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onStartScan}
          activeOpacity={0.9}
        >
          <Text variant="labelLarge" style={styles.buttonText}>
            Start Scan
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Right Section - Visual */}
      <View style={styles.rightSection}>
        <View style={styles.faceContainer}>
          {/* Holographic face effect - using a simple gradient circle with overlays */}
          <View style={styles.faceCircle}>
            <View style={styles.faceGlow} />
            {/* Simple face grid lines */}
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, styles.gridLineHorizontal]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8E5ED', // Light blue-gray background matching UI design
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 160,
    overflow: 'hidden',
    // Shadow for elevation
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  rightSection: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(91, 123, 143, 0.15)', // Semi-transparent blue
    borderWidth: 2,
    borderColor: 'rgba(91, 123, 143, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  faceGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  gridLine: {
    position: 'absolute',
    width: 1,
    height: 60,
    backgroundColor: 'rgba(91, 123, 143, 0.4)',
    left: '50%',
    transform: [{ translateX: -0.5 }],
  },
  gridLineHorizontal: {
    width: 60,
    height: 1,
    left: '50%',
    top: '50%',
    transform: [{ translateX: -30 }, { translateY: -0.5 }],
  },
});
