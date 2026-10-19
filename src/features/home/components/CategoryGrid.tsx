import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { colors, spacing, fontFamily } from '@/theme';
import { PRODUCT_CATEGORIES, CategoryItem } from '../data/categories';

interface CategoryGridProps {
  onCategoryPress?: (category: CategoryItem) => void;
  onViewAllPress?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onCategoryPress,
  onViewAllPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Shop by Category
        </Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text variant="labelMedium" style={styles.viewAllText}>
            View All →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Cards - Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={category.image}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            </View>
            <Text variant="labelMedium" style={styles.categoryName}>
              {category.name}
            </Text>
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
  categoryCard: {
    width: 90,
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    // Shadow for subtle elevation
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryImage: {
    width: 60,
    height: 70,
  },
  categoryName: {
    color: colors.onSurface,
    textAlign: 'center',
    fontSize: 13,
  },
});
