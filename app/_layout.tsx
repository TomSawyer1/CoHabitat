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
