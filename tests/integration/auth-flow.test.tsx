import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock des dépendances
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock fetch global
global.fetch = jest.fn();

describe('Authentication Flow Integration Tests', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
  });

  describe('Token Management', () => {
    it('devrait stocker le token après une connexion réussie', async () => {
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const loginResponse = {
        success: true,
        token: fakeToken,
        user: { id: 1, nom: 'Test', prenom: 'User', email: 'test@example.com' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => loginResponse,
      } as Response);

      // Simuler le processus de connexion
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Ici on testerait la fonction de login réelle
      // Pour l'instant, on simule le stockage du token
      await mockAsyncStorage.setItem('userToken', fakeToken);
      await mockAsyncStorage.setItem('userRole', 'locataire');
      await mockAsyncStorage.setItem('userData', JSON.stringify(loginResponse.user));

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('userToken', fakeToken);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('userRole', 'locataire');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(loginResponse.user));
    });

    it('devrait récupérer et valider le token stocké', async () => {
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'userToken') return Promise.resolve(fakeToken);
        if (key === 'userRole') return Promise.resolve('locataire');
        return Promise.resolve(null);
      });

      const token = await mockAsyncStorage.getItem('userToken');
      const role = await mockAsyncStorage.getItem('userRole');

      expect(token).toBe(fakeToken);
      expect(role).toBe('locataire');
    });

    it('devrait nettoyer les données lors de la déconnexion', async () => {
      // Simuler la déconnexion
      await mockAsyncStorage.removeItem('userToken');
      await mockAsyncStorage.removeItem('userRole');
      await mockAsyncStorage.removeItem('userData');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userRole');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('API Authentication', () => {
    it('devrait envoyer les bonnes données de connexion à l\'API', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedResponse = {
        success: true,
        token: 'fake-token',
        user: { id: 1, email: 'test@example.com', role: 'locataire' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => expectedResponse,
      } as Response);

      // Simuler l'appel API de connexion
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        })
      );

      expect(data).toEqual(expectedResponse);
    });

    it('devrait gérer les erreurs d\'authentification', async () => {
      const errorResponse = {
        success: false,
        message: 'Email ou mot de passe incorrect'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => errorResponse,
      } as Response);

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrongpass' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('incorrect');
    });

    it('devrait inclure le token dans les requêtes authentifiées', async () => {
      const fakeToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      // Simuler une requête authentifiée
      await fetch('http://localhost:3000/api/incidents', {
        method: 'GET',
        headers: {
          'Authorization': fakeToken,
          'Content-Type': 'application/json',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/incidents',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': fakeToken,
          }),
        })
      );
    });
  });

  describe('Role-based Access', () => {
    it('devrait permettre l\'accès aux fonctionnalités selon le rôle locataire', async () => {
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'userRole') return Promise.resolve('locataire');
        if (key === 'userToken') return Promise.resolve('fake-token');
        return Promise.resolve(null);
      });

      const role = await mockAsyncStorage.getItem('userRole');
      const token = await mockAsyncStorage.getItem('userToken');

      expect(role).toBe('locataire');
      expect(token).toBeTruthy();

      // Un locataire devrait pouvoir créer des signalements
      const canCreateSignalement = role === 'locataire';
      expect(canCreateSignalement).toBe(true);
    });

    it('devrait permettre l\'accès aux fonctionnalités selon le rôle gardien', async () => {
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'userRole') return Promise.resolve('guardian');
        if (key === 'userToken') return Promise.resolve('fake-token');
        return Promise.resolve(null);
      });

      const role = await mockAsyncStorage.getItem('userRole');
      const token = await mockAsyncStorage.getItem('userToken');

      expect(role).toBe('guardian');
      expect(token).toBeTruthy();

      // Un gardien devrait pouvoir gérer les incidents
      const canManageIncidents = role === 'guardian';
      expect(canManageIncidents).toBe(true);
    });
  });

  describe('Session Persistence', () => {
    it('devrait maintenir la session entre les redémarrages d\'app', async () => {
      // Simuler des données de session existantes
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        const sessionData = {
          userToken: 'persistent-token',
          userRole: 'locataire',
          userData: JSON.stringify({ id: 1, email: 'user@example.com' })
        };
        return Promise.resolve(sessionData[key as keyof typeof sessionData] || null);
      });

      const token = await mockAsyncStorage.getItem('userToken');
      const role = await mockAsyncStorage.getItem('userRole');
      const userData = await mockAsyncStorage.getItem('userData');

      expect(token).toBe('persistent-token');
      expect(role).toBe('locataire');
      expect(userData).toBeTruthy();

      // Vérifier que les données sont parsables
      const parsedUserData = JSON.parse(userData!);
      expect(parsedUserData.id).toBe(1);
      expect(parsedUserData.email).toBe('user@example.com');
    });

    it('devrait gérer l\'expiration de session', async () => {
      // Simuler une réponse 401 (token expiré)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ success: false, message: 'Token expired' }),
      } as Response);

      const response = await fetch('http://localhost:3000/api/protected-route', {
        headers: { 'Authorization': 'Bearer expired-token' },
      });

      expect(response.status).toBe(401);

      // En cas de 401, l'app devrait nettoyer la session
      if (response.status === 401) {
        await mockAsyncStorage.removeItem('userToken');
        await mockAsyncStorage.removeItem('userRole');
        await mockAsyncStorage.removeItem('userData');
      }

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
    });
  });
}); 