import { ImageSourcePropType } from 'react-native';

/**
 * Routine step interface
 */
export interface RoutineStep {
  id: string;
  stepNumber: number;
  stepName: string;
  productName: string;
  productImage: ImageSourcePropType;
  time: 'morning' | 'night' | 'both';
}

/**
 * Routine interface (morning or night)
 */
export interface Routine {
  id: string;
  name: 'morning' | 'night';
  steps: RoutineStep[];
}
