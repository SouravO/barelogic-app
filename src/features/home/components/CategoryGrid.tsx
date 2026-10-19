import { colors, fontSize, spacing } from '@/theme';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryItem, PRODUCT_CATEGORIES } from '../data/categories';

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
        <Text style={styles.headerTitle}>
          Shop by Category
        </Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>
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
                resizeMode="cover"
              />
            </View>
            <Text style={styles.categoryName}>
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
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontFamily: 'GoogleSansText-Regular',
    color: colors.onSurface,
    textAlign: 'center',
    fontSize: 13,
  },
});
