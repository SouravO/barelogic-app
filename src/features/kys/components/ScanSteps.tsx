import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STEPS = [
  { icon: 'camera-outline', title: 'Capture 3 angles', description: 'Front, left cheek, and right cheek.' },
  { icon: 'brain', title: 'AI analyzes 14 markers', description: 'Hydration, barrier, pigmentation, and more.' },
  { icon: 'chart-box-outline', title: 'Get your skin score', description: 'Diagnosis and recommended next steps.' },
];

export const ScanSteps: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>How it works</Text>
      {STEPS.map((step, index) => (
        <View key={step.title} style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={step.icon as any} size={20} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
          <Text style={styles.number}>{index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  title: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  copy: {
    flex: 1,
  },
  stepTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDescription: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
  },
  number: {
    color: colors.outline,
    fontSize: 13,
    fontWeight: '700',
  },
});