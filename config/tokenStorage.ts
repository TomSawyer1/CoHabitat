import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Stockage du JWT.
 *
 * Sur iOS/Android le token vit dans le Keychain / Keystore chiffré
 * (expo-secure-store) au lieu d'AsyncStorage, lisible en clair sur un
 * appareil rooté. Sur web, SecureStore n'existe pas : on retombe sur
 * AsyncStorage (localStorage), comme avant.
 *
 * Les anciens tokens stockés dans AsyncStorage sous "userToken" sont migrés
 * automatiquement à la première lecture.
 */

const TOKEN_KEY = "userToken";
const isWeb = Platform.OS === "web";

export async function getToken(): Promise<string | null> {
  if (isWeb) {
    return AsyncStorage.getItem(TOKEN_KEY);
  }

  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) return token;

  // Migration depuis l'ancien stockage AsyncStorage.
  const legacy = await AsyncStorage.getItem(TOKEN_KEY);
  if (legacy) {
    await SecureStore.setItemAsync(TOKEN_KEY, legacy);
    await AsyncStorage.removeItem(TOKEN_KEY);
    return legacy;
  }

  return null;
}

export async function setToken(token: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  // On purge les deux emplacements pour couvrir les installations migrées.
  await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
  if (!isWeb) {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
  }
}
