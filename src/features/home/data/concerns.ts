/**
 * Skin concerns data for Shop by Concern section
 */

export interface ConcernItem {
  id: string;
  name: string;
  gradient: string[];
}

export const SKIN_CONCERNS: ConcernItem[] = [
  {
    id: 'acne',
    name: 'Acne',
    gradient: ['#C5D5E0', '#B8CAD8'], // Cool gray/blue tones
  },
  {
    id: 'dryness',
    name: 'Dryness',
    gradient: ['#E8E2DA', '#D8D0C5'], // Warm beige/cream tones
  },
  {
    id: 'pigmentation',
    name: 'Pigmentation',
    gradient: ['#E8D5C8', '#DCC5B8'], // Soft peach/skin tones
  },
];
