/**
 * Hero carousel slides data
 */

export interface HeroSlide {
  id: string;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  image: any;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'manuka-cream',
    label: 'New Launch',
    title: 'Manuka Rich\nCream',
    description: 'Deep hydration.\nStronger skin barrier.',
    buttonText: 'Shop Now',
    image: require('@/assets/images/slide_img.png'),
  },
  {
    id: 'barrier-serum',
    label: 'Bestseller',
    title: 'Barrier Repair\nComplex',
    description: '10% Niacinamide.\nClinical strength.',
    buttonText: 'Shop Now',
    image: require('@/assets/images/slide_img.png'),
  },
  {
    id: 'lipid-cream',
    label: 'Editor\'s Choice',
    title: 'Lipid\nReplenishing Cream',
    description: 'Rich moisture.\nLasting comfort.',
    buttonText: 'Shop Now',
    image: require('@/assets/images/slide_img.png'),
  },
];
