import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { RoutineStepCard } from './RoutineStepCard';
import type { RoutineStep } from '../types';

interface RoutineStepListProps {
  steps: RoutineStep[];
  routineType: 'morning' | 'night';
  onStepPress: (step: RoutineStep) => void;
}

export const RoutineStepList: React.FC<RoutineStepListProps> = ({ 
  steps, 
  routineType,
  onStepPress 
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <RoutineStepCard
          key={step.id}
          step={step}
          routineType={routineType}
          onPress={onStepPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
