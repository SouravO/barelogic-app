import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INACTIVE_ICON = '#879295';
const ACTIVE_CIRCLE = '#b9d2de85';
const ACTIVE_ICON = '#075B5A';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACTIVE_ICON,
        tabBarInactiveTintColor: INACTIVE_ICON,
        tabBarActiveBackgroundColor: ACTIVE_CIRCLE,
        sceneStyle: {
          paddingBottom: 60 + bottomInset + 12,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: bottomInset + 6,
          height: 60,
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingHorizontal: 10,
          paddingVertical: 4,
          marginHorizontal:12,
          elevation: 2,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          borderRadius: 24,
          marginHorizontal: 4,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          overflow: 'hidden',
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          letterSpacing: 0.3
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color={focused ? ACTIVE_ICON : INACTIVE_ICON}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
                name="storefront-outline"
                size={20}
                color={focused ? ACTIVE_ICON : INACTIVE_ICON}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="kys"
        options={{
          title: 'KYS',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
                name="face-man-outline"
                size={22}
                color={focused ? ACTIVE_ICON : INACTIVE_ICON}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          title: 'Routine',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
                name="calendar-check-outline"
                size={20}
                color={focused ? ACTIVE_ICON : INACTIVE_ICON}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons
                name="person-outline"
                size={20}
                color={focused ? ACTIVE_ICON : INACTIVE_ICON}
              />
          ),
        }}
      />
      {/* Cart is a focused checkout screen: hide tab and tab bar */}
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      {/* Hide default explore tab if present */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

