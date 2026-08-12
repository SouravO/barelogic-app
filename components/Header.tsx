import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SaharaTheme, Fonts } from '@/constants/theme';

interface HeaderProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onNotificationPress?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  onSearchPress,
  onCartPress,
  onNotificationPress,
  cartCount = 2,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, 12);

  return (
    <View style={[styles.container, { paddingTop, height: 56 + paddingTop }]}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
        accessibilityLabel="Menu"
      >
        <Feather name="menu" size={22} color={SaharaTheme.onSurfaceVariant} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>bare logic</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
          accessibilityLabel="Search"
        >
          <Ionicons name="search-outline" size={22} color={SaharaTheme.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCartPress}
          activeOpacity={0.7}
          accessibilityLabel="Shopping Cart"
        >
          <Feather name="shopping-bag" size={21} color={SaharaTheme.onSurfaceVariant} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={21} color={SaharaTheme.onSurfaceVariant} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: `${SaharaTheme.surface}F0`,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SaharaTheme.outlineVariant,
    zIndex: 100,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: Fonts?.serif,
    fontSize: 26,
    fontWeight: '500',
    color: SaharaTheme.primary,
    letterSpacing: -0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: SaharaTheme.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: SaharaTheme.onPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: SaharaTheme.primary,
  },
});
