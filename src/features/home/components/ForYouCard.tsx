import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ForYouCardProps {
  onViewPicksPress?: () => void;
}

export const ForYouCard: React.FC<ForYouCardProps> = ({ onViewPicksPress }) => {
  return (
    <View style={styles.container}>
      {/* Icon and Title */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="star" size={15} color={colors.primary} />
        </View>
        <Text style={styles.title}>For You</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Personalised recommendations{'\n'}based on your skin scan.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onViewPicksPress}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>View Your Picks</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.surface} />
      </TouchableOpacity>

      {/* Holographic Face Visual (Right Side) */}
      <View style={styles.faceVisual}>
        <View style={styles.faceCircle}>
          <View style={styles.faceGlow} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F0F5', // Light blue background
    borderRadius: 20,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
    lineHeight: 20,
    maxWidth: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 6,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  buttonText: {
    fontFamily: 'GoogleSansText-Medium',
    color: colors.surface,
    fontWeight: '600',
    fontSize: 13
  },
  faceVisual: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -50 }],
    width: 100,
    height: 100,
  },
  faceCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(91, 123, 143, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(91, 123, 143, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
