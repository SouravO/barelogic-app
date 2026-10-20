/**
 * Product categories data for Shop by Category section
 */

export interface CategoryItem {
  id: string;
  name: string;
  image: any;
}

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cleansers',
    name: 'Cleansers',
    image: require('@/assets/images/toner_02.png'),
  },
  {
    id: 'serums',
    name: 'Serums',
    image: require('@/assets/images/serum_01.png'),
  },
  {
    id: 'moisturisers',
    name: 'Moisturisers',
    image: require('@/assets/images/moisturizer_02.png'),
  },
  {
    id: 'sunscreen',
    name: 'Sunscreen',
    image: require('@/assets/images/serum_01.png'), // Reusing as placeholder
  },
];
