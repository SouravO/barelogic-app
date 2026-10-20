import { ImageSourcePropType } from 'react-native';

/**
 * Product item displayed on home screen
 */
export interface ProductItem {
  id: string;
  title: string;
  price: string;
  categoryTag: string;
  badge?: string;
  image: ImageSourcePropType;
}

/**
 * Product card component props
 */
export interface ProductCardProps {
  product: ProductItem;
  onPress: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}
