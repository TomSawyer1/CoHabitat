import {
    DefaultTheme,
    ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import "react-native-reanimated";
import Splash from "./splash";

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  // Charger les polices
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // État pour indiquer si l'application JS est prête après le splash
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Attendre que les polices soient chargées
        if (!fontsLoaded) {
          return; // Ne rien faire si les polices ne sont pas encore chargées
        }

        // Vous pourriez charger d'autres assets ici (images, etc.)

        // Simuler un délai minimum pour le splash screen (par exemple, 2 secondes)
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (e) {
        console.warn(e);
      } finally {
        // Indiquer que l'application JS est prête
        setIsAppReady(true);
        // Masquer le splash screen natif
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]); // Dépend du chargement des polices

  // Gérer la navigation vers l'écran d'accueil une fois que l'application est prête
  useEffect(() => {
    if (isAppReady) {
      // Naviguer vers l'écran d'accueil
      router.replace('/accueil');
    }
  }, [isAppReady, router]); // Dépend de l'état de préparation de l'application

  // Gérer les liens profonds (écoute uniquement une fois que l'app JS est potentiellement prête)
  useEffect(() => {
    if (!isAppReady) return; // Ne pas attacher les listeners avant que l'app soit prête

    const subscription = Linking.addEventListener('url', (event) => {
      const url = event.url;
      if (url) {
        // Pour l'instant, on redirige toujours vers l'accueil pour tout lien externe
        router.replace('/accueil');
      }
    });

    // Gérer le lien initial (si l'app a été ouverte par un lien)
    Linking.getInitialURL().then((url) => {
      if (url) {
        // Pour l'instant, on redirige toujours vers l'accueil pour tout lien initial
        router.replace('/accueil');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAppReady, router]); // Dépend de l'état de préparation de l'application

  // Si l'application n'est pas encore prête, afficher l'écran de splash (JS)
  if (!isAppReady) {
    return <Splash />;
  }

  // Rendu de l'application principale une fois le splash terminé
  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="accueil" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="gardian-login" options={{ headerShown: false }} />
          <Stack.Screen
            name="gardian-register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="signalement" options={{ headerShown: false }} />
          <Stack.Screen name="suivresignal" options={{ headerShown: false }} />
          <Stack.Screen name="profil" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="batiments" options={{ headerShown: false }} />
          <Stack.Screen name="mon-batiment" options={{ headerShown: false }} />
          <Stack.Screen name="mon-gardien" options={{ headerShown: false }} />
          <Stack.Screen name="parametres" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
