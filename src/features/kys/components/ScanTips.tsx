import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

const TIPS = [
  'Use bright, even lighting and avoid harsh shadows.',
  'Remove glasses and keep hair away from your face.',
  'Look straight at the camera for the first photo.',
];

export const ScanTips: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tips for best results</Text>
      {TIPS.map((tip) => (
        <View key={tip} style={styles.row}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accentGreen} />
          <Text style={styles.text}>{tip}</Text>
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
    gap: spacing.sm,
  },
  title: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  text: {
    flex: 1,
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 19,
  },
});