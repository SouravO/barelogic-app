import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import type { RoutineStep } from '../types';

interface RoutineStepCardProps {
  step: RoutineStep;
  routineType: 'morning' | 'night';
  onPress: (step: RoutineStep) => void;
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({ 
  step, 
  routineType,
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(step)}
      activeOpacity={0.7}
    >
      {/* Step Number Circle */}
      <View style={styles.stepNumberCircle}>
        <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
      </View>

      {/* Step Info */}
      <View style={styles.stepInfo}>
        <Text style={styles.stepName}>{step.stepName}</Text>
        <Text style={styles.productName}>{step.productName}</Text>
      </View>

      {/* Timing Indicator */}
      <View style={styles.iconContainer}>
        {routineType === 'morning' ? (
          <Ionicons name="sunny" size={20} color="#F59E0B" />
        ) : (
          <Ionicons name="moon" size={20} color={colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: spacing.md,
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 18,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: 2,
  },
  productName: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
