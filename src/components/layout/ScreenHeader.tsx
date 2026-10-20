import React from 'react';
import { AppNavbar } from './AppNavbar';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  onRightPress?: () => void;
  rightLabel?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
  return <AppNavbar variant="screen" {...props} />;
};