import React from 'react';
import { AppNavbar } from './AppNavbar';

interface HeaderProps {
  onSearchPress?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return <AppNavbar variant="main" title="NOTWO" {...props} />;
};