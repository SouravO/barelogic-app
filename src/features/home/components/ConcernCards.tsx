import { colors, fontSize, spacing } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConcernItem, SKIN_CONCERNS } from '../data/concerns';

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
        <Text style={styles.headerTitle}>
          Shop by Concern
        </Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>
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
              colors={concern.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.concernCard}
            >
              {/* Semi-transparent overlay for text readability */}
              <View style={styles.overlay} />
              
              <Text style={styles.concernName}>
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
    fontFamily: 'GoogleSansText-Bold',
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.bodyLg,
  },
  viewAllText: {
    fontFamily: 'GoogleSansText-Regular',
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
    justifyContent: 'flex-start',
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
    fontFamily: 'GoogleSansText-Medium',
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
    zIndex: 1,
  },
});
