import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';
import { ProductItem } from './ProductCard';

interface NewFormulationsProps {
  onProductPress?: (product: ProductItem) => void;
  onAddToCart?: (product: ProductItem) => void;
  onViewAll?: () => void;
}

const NEW_PRODUCTS: ProductItem[] = [
  {
    id: 'eye_01',
    categoryTag: 'EYE 01',
    title: 'Peptide Eye Matrix',
    price: '$55',
    image: require('@/assets/images/eye_01.png'),
  },
  {
    id: 'toner_02',
    categoryTag: 'TONER 02',
    title: 'Clarifying Acid Solution',
    price: '$42',
    badge: 'AHA/BHA',
    image: require('@/assets/images/toner_02.png'),
  },
  {
    id: 'serum_03',
    categoryTag: 'VITAMIN C 03',
    title: 'Cellular Radiance Serum',
    price: '$78',
    badge: '15% L-Ascorbic',
    image: require('@/assets/images/serum_01.png'),
  },
];

export const NewFormulations: React.FC<NewFormulationsProps> = ({
  onProductPress,
  onAddToCart,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>New Formulations</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NEW_PRODUCTS.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            onPress={() => onProductPress?.(product)}
            activeOpacity={0.88}
          >
            <View style={styles.imageContainer}>
              <Image source={product.image} style={styles.image} resizeMode="cover" />

              {product.badge ? (
                <View style={styles.glassBadge}>
                  <Text style={styles.glassBadgeText}>{product.badge}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.categoryTag}>{product.categoryTag}</Text>
            <Text style={styles.productTitle} numberOfLines={1}>
              {product.title}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{product.price}</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => onAddToCart?.(product)}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={14} color={SaharaTheme.onPrimary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
  },
  sectionTitle: {
    fontFamily: Fonts?.serif,
    fontSize: 22,
    fontWeight: '500',
    color: SaharaTheme.primary,
  },
  viewAllText: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '700',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  card: {
    width: 200,
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: SaharaTheme.surfaceContainerLow,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  glassBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(216, 208, 200, 0.5)',
  },
  glassBadgeText: {
    fontFamily: Fonts?.sans,
    fontSize: 10,
    fontWeight: '600',
    color: SaharaTheme.primary,
  },
  categoryTag: {
    fontFamily: Fonts?.sans,
    fontSize: 11,
    fontWeight: '600',
    color: SaharaTheme.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productTitle: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '500',
    color: SaharaTheme.primary,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600',
    color: SaharaTheme.onSurfaceVariant,
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SaharaTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
