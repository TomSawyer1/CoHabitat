import {
    DefaultTheme,
    ThemeProvider
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "../config/tokenStorage";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { setUnauthorizedHandler } from "../config/api";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Intercepteur global 401 : si une requête API échoue avec un token expiré,
  // on est automatiquement redirigé vers la page de connexion (le storage est
  // déjà purgé par apiFetch).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      router.replace("/auth/login");
    });
  }, [router]);

  // Garde de navigation globale (démo publique) : empêche l'accès aux écrans
  // protégés sans session. Seuls `auth/*` et la page d'accueil publique
  // (`accueil/index`) sont libres ; le tableau de bord `accueil/home` est privé.
  useEffect(() => {
    const check = async () => {
      const root = segments?.[0];
      const sub = segments?.[1];
      const isPublic =
        !root ||
        root === "auth" ||
        (root === "accueil" && sub !== "home");
      if (isPublic) return;

      const token = await getToken();
      const role = await AsyncStorage.getItem("userRole");
      if (!token) {
        router.replace(role === "guardian" ? "/auth/gardian-login" : "/auth/login");
      }
    };
    void check();
  }, [router, segments]);

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
          <Stack.Screen name="signalements/incidents" options={{ headerShown: false }} />
          <Stack.Screen name="profil/profil" options={{ headerShown: false }} />
  
          <Stack.Screen name="accueil/home" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/mon-batiment" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/mon-gardien" options={{ headerShown: false }} />
          <Stack.Screen name="profil/parametres" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
