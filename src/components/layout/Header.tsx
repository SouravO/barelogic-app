import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { colors } from '@/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onNotificationPress?: () => void;
  cartCount?: number;
}

// Icon glyph colors stay on the theme object: @expo/vector-icons are font
// glyphs driven by a color prop, not a className token.
const iconButton =
  'h-10 w-10 items-center justify-center rounded-full data-[active=true]:opacity-70';

export const Header: React.FC<HeaderProps> = ({
  onSearchPress,
  onCartPress,
  cartCount = 0,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, 12);

  return (
    <Box
      className="flex-row items-center justify-between bg-card px-6"
      style={{ paddingTop, height: 56 + paddingTop, zIndex: 100 }}
    >
      <Box className="items-center justify-center">
        <Heading size="xl" className="tracking-wider">
          NOTWO
        </Heading>
      </Box>

      <HStack className="items-center" space="xs">
        <Pressable
          className={iconButton}
          onPress={onSearchPress}
          accessibilityLabel="Search"
        >
          <Ionicons name="search-outline" size={22} color={colors.onSurface} />
        </Pressable>

        <Pressable
          className={iconButton}
          onPress={onCartPress}
          accessibilityLabel="Shopping Cart"
        >
          <Feather name="shopping-bag" size={21} color={colors.onSurface} />
          {cartCount > 0 && (
            <Box className="absolute right-1 top-1 h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1">
              <Text className="text-2xs font-bold text-destructive-foreground">
                {cartCount}
              </Text>
            </Box>
          )}
        </Pressable>
      </HStack>
    </Box>
  );
};
