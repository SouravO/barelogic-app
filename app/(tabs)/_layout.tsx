import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { PlatformPressable } from 'expo-router/build/react-navigation/elements';
import { Text, View, type ColorValue } from 'react-native';

import { colors } from '@/theme';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INACTIVE_ICON = '#879295';
const ACTIVE_CIRCLE = '#b9d2de85';
const ACTIVE_ICON = '#5a7b8f';

function CurvedTabLabel({ label, color }: { label: string; color: ColorValue }) {
  return (
    <Text
      style={{
        width: 56,
        height: 14,
        color,
        fontSize: 8,
        lineHeight: 11,
        fontWeight: '600',
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
  );
}

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
        tabBarButton: ({ children, style, 'aria-selected': selected, ...props }) => (
          <PlatformPressable
            {...props}
            style={[
              style,
              selected
                ? { backgroundColor: ACTIVE_CIRCLE, borderRadius: 999 }
                : null,
            ]}
          >
            {children}
          </PlatformPressable>
        ),
        sceneStyle: {
          paddingBottom: 30,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['transparent', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: -20,
              left: -24,
              right: -24,
              bottom: 0,
            }}
            pointerEvents="none"
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: bottomInset + 6,
          height: 60,
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          // paddingHorizontal: 10,
          paddingVertical: 4,
          marginHorizontal:24,
          elevation: 2,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarItemStyle: {
          borderRadius: 999,
          margin: 4,
          alignItems: 'center',
          justifyContent: 'center',
          height: 52,
          paddingVertical: -2,
          overflow: 'hidden',
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ color }) => (
            <CurvedTabLabel label="Home" color={color} />
          ),
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
          tabBarLabel: ({ color }) => (
            <CurvedTabLabel label="Shop" color={color} />
          ),
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
          tabBarButton: (props) => <PlatformPressable {...props} />,
          tabBarItemStyle: {
            overflow: 'visible',
          },
          tabBarLabel: ({ color }) => (
            <View style={{ marginTop: 5 }}>
              <CurvedTabLabel label="KYS" color={color} />
            </View>
          ),
          tabBarIcon: () => (
            <LinearGradient
              colors={[colors.primary, colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                marginTop: -34,
                width: 62,
                height: 62,
                borderRadius: 99,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <MaterialCommunityIcons
                name="face-man-outline"
                size={34}
                color="#FFFFFF"
              />
            </LinearGradient>
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          title: 'Routine',
          tabBarLabel: ({ color }) => (
            <CurvedTabLabel label="Routine" color={color} />
          ),
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
          tabBarLabel: ({ color }) => (
            <CurvedTabLabel label="Profile" color={color} />
          ),
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
