import { Platform } from 'react-native';

// Configuration centralisée pour l'API CoHabitat
let API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  if (__DEV__) {
    console.warn('⚠️ EXPO_PUBLIC_API_BASE_URL non définie dans .env');
    console.warn('💡 Configurez votre .env selon votre mode :');
    console.warn('📱 Expo Go → localhost:3000');
    console.warn('🤖 Android émulateur → 10.0.2.2:3000');
    console.warn('🍎 iOS simulateur → localhost:3000');
  }

  // Valeurs par défaut selon la plateforme
  if (Platform.OS === 'android') {
    API_BASE_URL = 'http://10.0.2.2:3000';
  } else {
    API_BASE_URL = 'http://localhost:3000';
  }
}

// Validation de l'URL
if (!API_BASE_URL.startsWith('http')) {
  if (__DEV__) console.error('❌ URL API invalide:', API_BASE_URL);
  throw new Error('URL API invalide dans la configuration');
}

if (__DEV__) {
  console.log(`🔗 API : ${API_BASE_URL}`);
  console.log(`📱 Plateforme : ${Platform.OS}`);
}

export {
    API_BASE_URL
};

// Fonction utilitaire pour debug
export const getApiConfig = () => {
  return {
    url: API_BASE_URL!,
    platform: Platform.OS,
    mode: API_BASE_URL!.includes('10.0.2.2') ? 'Android Émulateur' :
          API_BASE_URL!.includes('localhost') ? 'Expo Go / iOS' : 'Personnalisé'
  };
};

// Ajoute d'autres constantes ou objets de configuration ici
