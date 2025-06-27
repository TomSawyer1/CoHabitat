import { Platform } from 'react-native';

// Configuration centralisée pour l'API GuardConnect
let API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('⚠️ EXPO_PUBLIC_API_BASE_URL non définie dans .env');
  console.warn('💡 Configurez votre .env selon votre mode :');
  console.warn('📱 Expo Go → localhost:3000');
  console.warn('🤖 Android émulateur → 10.0.2.2:3000');
  console.warn('🍎 iOS simulateur → localhost:3000');
  
  // Valeurs par défaut selon la plateforme
  if (Platform.OS === 'android') {
    API_BASE_URL = 'http://10.0.2.2:3000';
    console.log('🤖 Mode par défaut : Android émulateur');
  } else {
    API_BASE_URL = 'http://localhost:3000';
    console.log('🍎 Mode par défaut : iOS/Expo Go');
  }
} else {
  // Déterminer le mode selon l'URL configurée
  if (API_BASE_URL.includes('10.0.2.2')) {
    console.log('🤖 Mode configuré : Android Émulateur');
  } else if (API_BASE_URL.includes('localhost')) {
    console.log('📱 Mode configuré : Expo Go / iOS Simulateur');
  } else {
    console.log('🌐 Mode configuré : URL personnalisée');
  }
}

// Validation de l'URL
if (!API_BASE_URL.startsWith('http')) {
  console.error('❌ URL API invalide:', API_BASE_URL);
  throw new Error('URL API invalide dans la configuration');
}

// Log final
console.log(`🔗 API : ${API_BASE_URL}`);
console.log(`📱 Plateforme : ${Platform.OS}`);

const BACKEND_PORT = process.env.BACKEND_PORT || '3000';

export {
  API_BASE_URL,
  BACKEND_PORT
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