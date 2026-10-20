import type { ProductItem } from '../types';

/**
 * Bestseller products displayed on home screen
 */
export const BESTSELLERS: ProductItem[] = [
  {
    id: 'serum_01',
    categoryTag: 'SERUM 01',
    title: 'Barrier Repair Complex',
    price: '$68',
    badge: '10% Niacinamide',
    image: require('@/assets/images/serum_01.png'),
  },
  {
    id: 'moisturizer_02',
    categoryTag: 'MOISTURIZER 02',
    title: 'Lipid Replenishing Cream',
    price: '$85',
    image: require('@/assets/images/moisturizer_02.png'),
  },
];
