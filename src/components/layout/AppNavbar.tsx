import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface AppNavbarProps {
  variant?: 'main' | 'screen';
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onRightPress?: () => void;
  rightLabel?: string;
  backgroundColor?: string;
  borderBottom?: boolean;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  variant = 'screen',
  title,
  subtitle,
  showBack = true,
  onBackPress,
  onSearchPress,
  onCartPress,
  cartCount = 0,
  rightIcon,
  onRightPress,
  rightLabel,
  backgroundColor = colors.surface,
  borderBottom = true,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(insets.top, variant === 'main' ? 12 : 8);

  if (variant === 'main') {
    return (
      <View
        style={[
          styles.mainContainer,
          {
            paddingTop,
            height: 56 + paddingTop,
            backgroundColor,
            borderBottomWidth: borderBottom ? StyleSheet.hairlineWidth : 0,
            borderBottomColor: colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.mainTitleContainer}>
          <Text style={styles.mainTitle}>{title || 'NOTWO'}</Text>
        </View>

        <View style={styles.mainActions}>
          {onSearchPress ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              accessibilityLabel="Search"
            >
              <Ionicons name="search-outline" size={22} color={colors.onSurface} />
            </TouchableOpacity>
          ) : null}

          {onCartPress ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onCartPress}
              accessibilityLabel="Shopping Cart"
            >
              <Feather name="shopping-bag" size={21} color={colors.onSurface} />
              {cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}

        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screenContainer,
        {
          paddingTop: Math.max(insets.top, 8) + 4,
          backgroundColor,
          borderBottomWidth: borderBottom ? 1 : 0,
          borderBottomColor: colors.outlineVariant,
        },
      ]}
    >
      {showBack ? (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.headerButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}

      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      </View>

      {rightIcon || rightLabel || onRightPress ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          {rightIcon ? (
            <Ionicons name={rightIcon} size={24} color={colors.onSurface} />
          ) : (
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.paddingMobile,
    zIndex: 100,
  },
  mainTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mainTitle: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 20,
    letterSpacing: 2,
    color: colors.onSurface,
    fontWeight: '700',
  },
  mainActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    right: 6,
    top: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onError,
  },
  screenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontFamily: 'GoogleSansText-Bold',
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  screenSubtitle: {
    fontFamily: 'GoogleSansText-Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  rightLabel: {
    fontFamily: 'GoogleSansText-Medium',
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});