import { Platform } from 'react-native';

// Fichier de configuration centralisée pour l'application
// Ajoute ici tes variables d'environnement, URLs d'API, thèmes, etc.

let API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // Android émulateur
    if (Platform.OS === 'android') {
      API_BASE_URL = 'http://10.0.2.2:3000';
    }
    // iOS émulateur
    else if (Platform.OS === 'ios') {
      API_BASE_URL = 'http://localhost:3000';
    }
    // Device réel : à surcharger via EXPO_PUBLIC_API_BASE_URL
  } else {
    API_BASE_URL = 'http://localhost:3000';
  }
}

export { API_BASE_URL };

// Ajoute d'autres constantes ou objets de configuration ici 