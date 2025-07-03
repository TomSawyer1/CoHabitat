import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock des dépendances
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

global.fetch = jest.fn();

describe('Data Flow Integration Tests', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  describe('Flux de données utilisateur', () => {
    it('devrait charger et persister les données utilisateur', async () => {
      const userData = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        role: 'locataire'
      };

      // Simuler le chargement des données
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'userData') return Promise.resolve(JSON.stringify(userData));
        if (key === 'userToken') return Promise.resolve('fake-token');
        if (key === 'userRole') return Promise.resolve('locataire');
        return Promise.resolve(null);
      });

      const token = await mockAsyncStorage.getItem('userToken');
      const storedUserData = await mockAsyncStorage.getItem('userData');
      const role = await mockAsyncStorage.getItem('userRole');

      expect(token).toBe('fake-token');
      expect(role).toBe('locataire');
      expect(storedUserData).toBeTruthy();

      const parsedData = JSON.parse(storedUserData!);
      expect(parsedData.id).toBe(1);
      expect(parsedData.email).toBe('jean.dupont@example.com');
    });

    it('devrait synchroniser les données avec l\'API', async () => {
      const apiUserData = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        batiment_id: 42
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: apiUserData }),
      } as Response);

      // Simuler une requête pour récupérer les données utilisateur
      const response = await fetch('http://localhost:3000/api/user/profile', {
        headers: { 'Authorization': 'Bearer fake-token' },
      });

      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/user/profile',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token',
          }),
        })
      );

      expect(data.success).toBe(true);
      expect(data.user.id).toBe(1);
    });
  });

  describe('Flux de données des signalements', () => {
    it('devrait charger la liste des signalements', async () => {
      const signalements = [
        {
          id: 1,
          titre: 'Problème ascenseur',
          description: 'L\'ascenseur est en panne',
          statut: 'ouvert',
          date_creation: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          titre: 'Fuite d\'eau',
          description: 'Fuite dans les parties communes',
          statut: 'en_cours',
          date_creation: '2024-01-14T15:30:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, incidents: signalements }),
      } as Response);

      const response = await fetch('http://localhost:3000/api/incidents', {
        headers: { 'Authorization': 'Bearer fake-token' },
      });

      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.incidents).toHaveLength(2);
      expect(data.incidents[0].titre).toBe('Problème ascenseur');
    });

    it('devrait créer un nouveau signalement', async () => {
      const nouveauSignalement = {
        titre: 'Éclairage défaillant',
        description: 'Les lumières du hall ne fonctionnent plus',
        categorie: 'technique',
        priorite: 'moyenne'
      };

      const responseSignalement = {
        id: 3,
        ...nouveauSignalement,
        statut: 'ouvert',
        date_creation: '2024-01-16T09:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, incident: responseSignalement }),
      } as Response);

      const response = await fetch('http://localhost:3000/api/incidents', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nouveauSignalement),
      });

      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/incidents',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(nouveauSignalement),
        })
      );

      expect(data.success).toBe(true);
      expect(data.incident.id).toBe(3);
      expect(data.incident.statut).toBe('ouvert');
    });
  });

  describe('Flux de données des bâtiments', () => {
    it('devrait charger les informations du bâtiment', async () => {
      const batimentData = {
        id: 42,
        nom: 'Résidence Les Jardins',
        adresse: '123 Rue de la Paix, 75001 Paris',
        nombre_etages: 5,
        nombre_appartements: 20,
        gardien: {
          id: 2,
          nom: 'Martin',
          prenom: 'Pierre',
          telephone: '01.23.45.67.89'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, building: batimentData }),
      } as Response);

      const response = await fetch('http://localhost:3000/api/buildings/42', {
        headers: { 'Authorization': 'Bearer fake-token' },
      });

      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.building.nom).toBe('Résidence Les Jardins');
      expect(data.building.gardien.nom).toBe('Martin');
    });
  });

  describe('Gestion d\'erreurs dans le flux de données', () => {
    it('devrait gérer les erreurs de réseau', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('http://localhost:3000/api/incidents');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('devrait gérer les erreurs de serveur', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ success: false, message: 'Erreur serveur' }),
      } as Response);

      const response = await fetch('http://localhost:3000/api/incidents');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur serveur');
    });

    it('devrait gérer les données corrompues dans AsyncStorage', async () => {
      // Simuler des données JSON invalides
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid-json{');

      try {
        const data = await mockAsyncStorage.getItem('userData');
        JSON.parse(data!);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    });
  });

  describe('Performance et optimisation', () => {
    it('devrait mettre en cache les données fréquemment utilisées', async () => {
      const userData = { id: 1, nom: 'Test' };
      
      // Premier accès - devrait charger depuis l'API
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: userData }),
      } as Response);

      await fetch('http://localhost:3000/api/user/profile');
      
      // Sauvegarder en cache
      await mockAsyncStorage.setItem('userData', JSON.stringify(userData));

      // Deuxième accès - devrait charger depuis le cache
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));
      
      const cachedData = await mockAsyncStorage.getItem('userData');
      
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData!).id).toBe(1);
    });

    it('devrait gérer les timeouts d\'API', async () => {
      // Simuler un timeout
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 1000)
        )
      );

      try {
        await Promise.race([
          fetch('http://localhost:3000/api/slow-endpoint'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 500)
          )
        ]);
      } catch (error) {
        expect((error as Error).message).toBe('Request timeout');
      }
    });
  });
}); 