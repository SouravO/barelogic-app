import type { Routine } from '../types';

export const MORNING_ROUTINE: Routine = {
  id: 'morning',
  name: 'morning',
  steps: [
    {
      id: 'morning-step-1',
      stepNumber: 1,
      stepName: 'Cleanse',
      productName: 'Manuka Rich Cleanser',
      productImage: require('@/assets/images/toner_02.png'),
      time: 'both',
    },
    {
      id: 'morning-step-2',
      stepNumber: 2,
      stepName: 'Treat',
      productName: 'Algae Serum',
      productImage: require('@/assets/images/serum_01.png'),
      time: 'both',
    },
    {
      id: 'morning-step-3',
      stepNumber: 3,
      stepName: 'Moisturise',
      productName: 'Manuka Rich Cream',
      productImage: require('@/assets/images/moisturizer_02.png'),
      time: 'both',
    },
    {
      id: 'morning-step-4',
      stepNumber: 4,
      stepName: 'Protect',
      productName: 'SPF 50 Sunscreen',
      productImage: require('@/assets/images/moisturizer_02.png'),
      time: 'morning',
    },
  ],
};

export const NIGHT_ROUTINE: Routine = {
  id: 'night',
  name: 'night',
  steps: [
    {
      id: 'night-step-1',
      stepNumber: 1,
      stepName: 'Cleanse',
      productName: 'Manuka Rich Cleanser',
      productImage: require('@/assets/images/toner_02.png'),
      time: 'both',
    },
    {
      id: 'night-step-2',
      stepNumber: 2,
      stepName: 'Treat',
      productName: 'Algae Serum',
      productImage: require('@/assets/images/serum_01.png'),
      time: 'both',
    },
    {
      id: 'night-step-3',
      stepNumber: 3,
      stepName: 'Moisturise',
      productName: 'Manuka Rich Cream',
      productImage: require('@/assets/images/moisturizer_02.png'),
      time: 'both',
    },
  ],
};
