import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import { useColorScheme } from '@/src/hooks/use-color-scheme';

// Prevent splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load Google Sans Text fonts
  const [fontsLoaded, fontError] = useFonts({
    'GoogleSansText-Regular': require('../assets/fonts/GoogleSansText-Regular.ttf'),
    'GoogleSansText-Medium': require('../assets/fonts/GoogleSansText-Medium.ttf'),
    'GoogleSansText-Bold': require('../assets/fonts/GoogleSansText-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GluestackUIProvider mode="light">
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                },
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                contentStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            <StatusBar style="dark" />
          </SafeAreaProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </SafeAreaListener>
  );
}
