/**
 * Capture progress indicator showing Front | Left | Right steps
 */

import { Fonts, SaharaTheme } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export interface CaptureProgressBarProps {
  /** Current step index (0 = Front, 1 = Left, 2 = Right) */
  currentStep: 0 | 1 | 2;
  /** Array indicating which steps are completed */
  completedSteps: [boolean, boolean, boolean];
}

const STEPS = [
  { label: 'FRONT', icon: 'face-man' },
  { label: 'LEFT', icon: 'arrow-left' },
  { label: 'RIGHT', icon: 'arrow-right' },
];

export const CaptureProgressBar: React.FC<CaptureProgressBarProps> = ({
  currentStep,
  completedSteps,
}) => {
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.label}>
          <StepIndicator
            label={step.label}
            icon={step.icon}
            isActive={index === currentStep}
            isCompleted={completedSteps[index]}
          />
          {index < STEPS.length - 1 && (
            <View style={styles.connector}>
              <View
                style={[
                  styles.connectorLine,
                  completedSteps[index] && styles.connectorLineCompleted,
                ]}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

interface StepIndicatorProps {
  label: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ label, icon, isActive, isCompleted }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for active step
  useEffect(() => {
    if (isActive && !isCompleted) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, isCompleted, pulseAnim]);

  // Scale animation when completed
  useEffect(() => {
    if (isCompleted) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCompleted, scaleAnim]);

  const getContainerStyle = () => {
    if (isCompleted) {
      return [styles.stepCircle, styles.stepCircleCompleted];
    }
    if (isActive) {
      return [styles.stepCircle, styles.stepCircleActive];
    }
    return [styles.stepCircle, styles.stepCircleInactive];
  };

  const getIconColor = () => {
    if (isCompleted) return '#fff';
    if (isActive) return SaharaTheme.primary;
    return SaharaTheme.outlineVariant;
  };

  const getLabelStyle = () => {
    if (isCompleted || isActive) {
      return [styles.stepLabel, styles.stepLabelActive];
    }
    return styles.stepLabel;
  };

  return (
    <View style={styles.stepContainer}>
      <Animated.View
        style={[
          getContainerStyle(),
          {
            transform: [{ scale: isActive ? pulseAnim : scaleAnim }],
          },
        ]}
      >
        {isCompleted ? (
          <MaterialCommunityIcons name="check" size={22} color="#fff" />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={22} color={getIconColor()} />
        )}
      </Animated.View>
      <Text style={getLabelStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(5, 8, 22, 0.92)',
  },
  stepContainer: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepCircleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: SaharaTheme.primary,
    borderWidth: 3,
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepLabel: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.8,
  },
  stepLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  connector: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  connectorLine: {
    height: 2,
    backgroundColor: SaharaTheme.outlineVariant,
  },
  connectorLineCompleted: {
    backgroundColor: '#4CAF50',
  },
});
