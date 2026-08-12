import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SaharaTheme, Fonts } from '@/constants/theme';

export interface ProductItem {
  id: string;
  categoryTag: string;
  title: string;
  price: string;
  image: ImageSourcePropType;
  badge?: string;
}

interface ProductCardProps {
  product: ProductItem;
  onPress?: (product: ProductItem) => void;
  onAddToCart?: (product: ProductItem) => void;
  columnSpan?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  columnSpan = 1,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.container, columnSpan === 2 && styles.fullWidthContainer]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.88}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={product.image}
          style={styles.image}
          resizeMode="cover"
        />

        {product.badge ? (
          <View style={styles.glassBadge}>
            <Text style={styles.glassBadgeText}>{product.badge}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? SaharaTheme.primary : SaharaTheme.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={styles.categoryTag}>{product.categoryTag}</Text>
        <Text style={styles.productTitle} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price}</Text>

          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={() => onAddToCart?.(product)}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={16} color={SaharaTheme.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  fullWidthContainer: {
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
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
    fontSize: 11,
    fontWeight: '600',
    color: SaharaTheme.primary,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(250, 245, 238, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    paddingHorizontal: 2,
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
    fontSize: 15,
    fontWeight: '500',
    color: SaharaTheme.primary,
    lineHeight: 20,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: Fonts?.sans,
    fontSize: 15,
    fontWeight: '600',
    color: SaharaTheme.onSurfaceVariant,
  },
  addCartBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SaharaTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
