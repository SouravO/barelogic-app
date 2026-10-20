import { colors, fontSize, spacing } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BestsellerProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: any;
}

interface BestsellerSectionProps {
  onViewAllPress?: () => void;
  onProductPress?: (product: BestsellerProduct) => void;
  onAddToCart?: (product: BestsellerProduct) => void;
}

const BESTSELLER_PRODUCTS: BestsellerProduct[] = [
  {
    id: '1',
    name: 'Manuka Rich Cream',
    category: 'Deep Hydration',
    price: '₹2,999',
    rating: 4.8,
    image: require('@/assets/images/moisturizer_02.png'),
  },
  {
    id: '2',
    name: 'Algae Serum',
    category: 'Brightening',
    price: '₹2,499',
    rating: 4.7,
    image: require('@/assets/images/serum_01.png'),
  },
  {
    id: '3',
    name: 'Cica Moisturiser',
    category: 'Calming',
    price: '₹2,799',
    rating: 4.6,
    image: require('@/assets/images/moisturizer_02.png'),
  },
];

export const BestsellerSection: React.FC<BestsellerSectionProps> = ({
  onViewAllPress,
  onProductPress,
  onAddToCart,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bestsellers</Text>
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Product Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BESTSELLER_PRODUCTS.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => onProductPress?.(product)}
            activeOpacity={0.9}
          >
            <View style={styles.imageContainer}>
              <Image
                source={product.image}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productCategory} numberOfLines={1}>
                {product.category}
              </Text>
              
              <View style={styles.bottomRow}>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{product.price}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.rating}>{product.rating}</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddToCart?.(product);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
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
    paddingHorizontal: spacing.marginMobile,
  },
  headerTitle: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: fontSize.bodyLg,
    color: colors.primary,
    fontWeight: '600',
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
  productCard: {
    width: 130,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 110,
    backgroundColor: colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontFamily: 'GoogleSansText-Medium',
    fontSize: 13,
    color: colors.onSurface,
    marginBottom: 2,
  },
  productCategory: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flex: 1,
  },
  price: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  addButton: {
    padding: 2,
  },
});
