import {
    DefaultTheme,
    ThemeProvider
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { setUnauthorizedHandler } from "../config/api";

export default function RootLayout() {
  const router = useRouter();

  // Intercepteur global 401 : si une requête API échoue avec un token expiré,
  // on est automatiquement redirigé vers la page de connexion (le storage est
  // déjà purgé par apiFetch).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      router.replace("/auth/login");
    });
  }, [router]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="accueil/index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/gardian-login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/gardian-register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="signalements/signalement" options={{ headerShown: false }} />
          <Stack.Screen name="signalements/gerer-incidents" options={{ headerShown: false }} />
          <Stack.Screen name="signalements/suivresignal" options={{ headerShown: false }} />
          <Stack.Screen name="profil/profil" options={{ headerShown: false }} />
  
          <Stack.Screen name="accueil/home" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/batiments" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/mon-batiment" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/mon-gardien" options={{ headerShown: false }} />
          <Stack.Screen name="profil/parametres" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
