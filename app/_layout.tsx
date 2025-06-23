import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { View } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const router = useRouter();

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="accueil" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/gardian-login" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/gardian-register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="signalements/signalement" options={{ headerShown: false }} />
          <Stack.Screen name="signalements/gerer-incidents" options={{ headerShown: false }} />
          <Stack.Screen name="signalements/suivresignal" options={{ headerShown: false }} />
          <Stack.Screen name="profil/profil" options={{ headerShown: false }} />
          <Stack.Screen name="notifications/notifications" options={{ headerShown: false }} />
          <Stack.Screen name="accueil/home" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/batiments" options={{ headerShown: false }} />
          <Stack.Screen name="batiments/mon-batiment" options={{ headerShown: false }} />
          <Stack.Screen name="profil/mon-gardien" options={{ headerShown: false }} />
          <Stack.Screen name="profil/parametres" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}
