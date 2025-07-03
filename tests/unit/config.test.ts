import { getApiConfig } from '../../config/index';

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('Configuration API', () => {
  // Sauvegarde des variables d'environnement originales
  const originalEnv = process.env;

  beforeEach(() => {
    // Réinitialise l'environnement pour chaque test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore des variables d'environnement
    process.env = originalEnv;
  });

  describe('getApiConfig', () => {
    it('devrait retourner la configuration avec localhost pour iOS', () => {
      // Mock Platform.OS pour iOS
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      const config = getApiConfig();
      
      expect(config).toHaveProperty('url');
      expect(config).toHaveProperty('platform');
      expect(config).toHaveProperty('mode');
      expect(config.platform).toBe('ios');
    });

    it('devrait détecter le mode Android Émulateur', () => {
      // Set une URL d'Android émulateur
      process.env.EXPO_PUBLIC_API_BASE_URL = 'http://10.0.2.2:3000';
      
      jest.doMock('react-native', () => ({
        Platform: { OS: 'android' },
      }));

      const config = getApiConfig();
      
      expect(config.mode).toBe('Android Émulateur');
      expect(config.url).toContain('10.0.2.2');
    });

    it('devrait détecter le mode Expo Go / iOS', () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000';
      
      const config = getApiConfig();
      
      expect(config.mode).toBe('Expo Go / iOS');
      expect(config.url).toContain('localhost');
    });

    it('devrait détecter une URL personnalisée', () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
      
      const config = getApiConfig();
      
      expect(config.mode).toBe('Personnalisé');
      expect(config.url).toBe('https://api.example.com');
    });

    it('devrait inclure la plateforme actuelle', () => {
      jest.doMock('react-native', () => ({
        Platform: { OS: 'android' },
      }));

      const config = getApiConfig();
      
      expect(config.platform).toBeDefined();
      expect(['ios', 'android', 'web']).toContain(config.platform);
    });
  });

  describe('Validation d\'URL', () => {
    it('devrait valider les URLs avec protocole HTTP', () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000';
      
      expect(() => {
        require('../../config/index');
      }).not.toThrow();
    });

    it('devrait valider les URLs avec protocole HTTPS', () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';
      
      expect(() => {
        require('../../config/index');
      }).not.toThrow();
    });

    it('devrait rejeter les URLs sans protocole', () => {
      process.env.EXPO_PUBLIC_API_BASE_URL = 'localhost:3000';
      
      expect(() => {
        require('../../config/index');
      }).toThrow('URL API invalide dans la configuration');
    });
  });

  describe('Valeurs par défaut', () => {
    it('devrait utiliser localhost pour iOS par défaut', () => {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
      
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios' },
      }));

      // Re-import le module pour tester les valeurs par défaut
      const config = require('../../config/index');
      
      expect(config.API_BASE_URL).toBe('http://localhost:3000');
    });

    it('devrait utiliser 10.0.2.2 pour Android par défaut', () => {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
      
      jest.doMock('react-native', () => ({
        Platform: { OS: 'android' },
      }));

      const config = require('../../config/index');
      
      expect(config.API_BASE_URL).toBe('http://10.0.2.2:3000');
    });
  });
}); 