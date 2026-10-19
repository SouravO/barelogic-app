import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/Text';
import { colors, spacing, fontFamily } from '@/theme';
import { SKIN_CONCERNS, ConcernItem } from '../data/concerns';

interface ConcernCardsProps {
  onConcernPress?: (concern: ConcernItem) => void;
  onViewAllPress?: () => void;
}

export const ConcernCards: React.FC<ConcernCardsProps> = ({
  onConcernPress,
  onViewAllPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Shop by Concern
        </Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text variant="labelMedium" style={styles.viewAllText}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Concern Cards - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SKIN_CONCERNS.map((concern) => (
          <TouchableOpacity
            key={concern.id}
            style={styles.concernCardWrapper}
            onPress={() => onConcernPress?.(concern)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={concern.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.concernCard}
            >
              {/* Semi-transparent overlay for text readability */}
              <View style={styles.overlay} />
              
              <Text variant="titleMedium" style={styles.concernName}>
                {concern.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.marginMobile,
  },
  headerTitle: {
    fontFamily: fontFamily.serif,
    color: colors.primary,
    fontWeight: '600',
  },
  viewAllText: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.md,
  },
  concernCardWrapper: {
    borderRadius: 16,
    // Shadow for elevation
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  concernCard: {
    width: 130,
    height: 100,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  concernName: {
    color: colors.primary,
    fontWeight: '600',
    zIndex: 1,
  },
});
