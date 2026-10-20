/**
 * Skin concerns data for Shop by Concern section
 */

export interface ConcernItem {
  id: string;
  name: string;
  gradient: readonly [string, string, ...string[]];
}

export const SKIN_CONCERNS: ConcernItem[] = [
  {
    id: 'acne',
    name: 'Acne',
    gradient: ['#C5D5E0', '#B8CAD8'] as const, // Cool gray/blue tones
  },
  {
    id: 'dryness',
    name: 'Dryness',
    gradient: ['#E8E2DA', '#D8D0C5'] as const, // Warm beige/cream tones
  },
  {
    id: 'pigmentation',
    name: 'Pigmentation',
    gradient: ['#E8D5C8', '#DCC5B8'] as const, // Soft peach/skin tones
  },
];
