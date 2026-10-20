import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ScanHeroCardProps {
  onStartScan: () => void;
}

export const ScanHeroCard: React.FC<ScanHeroCardProps> = ({ onStartScan }) => {
  return (
    <View style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.badge}>
        <MaterialCommunityIcons name="shield-check" size={14} color={colors.onPrimary} />
        <Text style={styles.badgeText}>AI SKIN DIAGNOSTIC</Text>
      </View>

      <View style={styles.previewArea}>
        <View style={styles.faceGuideOuter}>
          <View style={styles.faceGuideInner}>
            <MaterialCommunityIcons name="face-man" size={72} color="rgba(255,255,255,0.75)" />
          </View>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Camera ready</Text>
        </View>
      </View>

      <Text style={styles.title}>Know Your Skin</Text>
      <Text style={styles.subtitle}>
        Capture 3 angles and get a 14-marker skin analysis with a personalized score.
      </Text>

      <TouchableOpacity style={styles.cta} onPress={onStartScan} activeOpacity={0.88}>
        <MaterialCommunityIcons name="scan-helper" size={22} color={colors.onPrimary} />
        <Text style={styles.ctaText}>START SCAN</Text>
      </TouchableOpacity>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="camera-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>3 photos</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="sparkles-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>14 markers</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>~30 sec</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101827',
    borderRadius: spacing.radiusXl,
    padding: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glow: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: spacing.lg,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  previewArea: {
    height: 220,
    borderRadius: spacing.radiusLg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  faceGuideOuter: {
    width: 132,
    height: 164,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91,123,143,0.12)',
  },
  faceGuideInner: {
    width: 112,
    height: 144,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    position: 'absolute',
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusFull,
    backgroundColor: 'rgba(16,185,129,0.16)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGreen,
  },
  statusText: {
    color: colors.accentGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusFull,
    marginBottom: spacing.lg,
  },
  ctaText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  metaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
});