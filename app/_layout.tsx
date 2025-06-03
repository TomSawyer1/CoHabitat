import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

// NOTE: remove this when done with the splash screen logic
// import CustomSplashScreen from '@/components/CustomSplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import Splash from './splash';

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      setAppIsReady(true);
    }
  }, [loaded, error]);

  // Masquer le splash screen après un délai
  useEffect(() => {
    if (appIsReady) {
      const timer = setTimeout(() => {
        setSplashVisible(false);
      }, 2000); // 2000ms = 2 secondes
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && !splashVisible) {
      // This tells the native splash screen to hide immediately, as soon as the react view is rendered.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, splashVisible]);

  if (splashVisible) {
    return <Splash />;
  }

  if (!appIsReady) {
    return null; // Ou un indicateur de chargement si nécessaire avant le splash
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="accueil" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="gardian-login" options={{ headerShown: false }} />
          <Stack.Screen name="gardian-register" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
