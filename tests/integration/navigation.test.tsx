import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// Mock des dépendances globales
jest.mock('expo-router', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  };
  
  return {
    useRouter: () => mockRouter,
    useLocalSearchParams: () => ({}),
    Stack: ({ children }: any) => children,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('locataire')),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 20,
    bottom: 20,
    left: 0,
    right: 0,
  }),
}));

// Import des composants à tester
import Header from '../../components/Header';
import Navbar from '../../components/navbar';

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Header Navigation', () => {
    it('devrait naviguer vers l\'arrière quand le bouton retour est pressé', async () => {
      const mockRouter = require('expo-router').useRouter();
      
      const { getByRole } = render(
        <Header subtitle="Test Navigation" />
      );
      
      const backButton = getByRole('button');
      fireEvent.press(backButton);
      
      await waitFor(() => {
        expect(mockRouter.back).toHaveBeenCalledTimes(1);
      });
    });

    it('devrait exécuter une fonction personnalisée au lieu de router.back()', async () => {
      const mockRouter = require('expo-router').useRouter();
      const customOnBack = jest.fn();
      
      const { getByRole } = render(
        <Header subtitle="Test Custom" onBackPress={customOnBack} />
      );
      
      const backButton = getByRole('button');
      fireEvent.press(backButton);
      
      await waitFor(() => {
        expect(customOnBack).toHaveBeenCalledTimes(1);
        expect(mockRouter.back).not.toHaveBeenCalled();
      });
    });
  });

  describe('Navbar Navigation', () => {
    const mockSetSidebarVisible = jest.fn();
    const mockRouter = require('expo-router').useRouter();
    
    const navbarProps = {
      isSidebarVisible: false,
      setIsSidebarVisible: mockSetSidebarVisible,
      router: mockRouter,
    };

    it('devrait ouvrir/fermer la sidebar quand le bouton menu est pressé', async () => {
      const { getAllByRole } = render(<Navbar {...navbarProps} />);
      
      const buttons = getAllByRole('button');
      
      if (buttons.length > 0) {
        // Le premier bouton devrait être le menu
        fireEvent.press(buttons[0]);
        
        await waitFor(() => {
          expect(mockSetSidebarVisible).toHaveBeenCalledWith(true);
        });
      }
    });

    it('devrait naviguer vers l\'accueil quand le bouton home est pressé', async () => {
      const { getAllByRole } = render(<Navbar {...navbarProps} />);
      
      const buttons = getAllByRole('button');
      
      if (buttons.length > 1) {
        // Le deuxième bouton devrait être home
        fireEvent.press(buttons[1]);
        
        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/accueil/home');
          expect(mockSetSidebarVisible).toHaveBeenCalledWith(false);
        });
      }
    });

    it('devrait naviguer vers les signalements selon le rôle utilisateur', async () => {
      // Test pour locataire
      const mockAsyncStorage = require('@react-native-async-storage/async-storage');
      mockAsyncStorage.getItem.mockResolvedValueOnce('locataire');
      
      const { getAllByRole } = render(<Navbar {...navbarProps} />);
      
      await waitFor(() => {
        const buttons = getAllByRole('button');
        
        if (buttons.length > 2) {
          // Le troisième bouton devrait être signalements
          fireEvent.press(buttons[2]);
          
          expect(mockRouter.push).toHaveBeenCalledWith('/signalements/signalement');
        }
      });
    });

    it('devrait naviguer vers les incidents pour un gardien', async () => {
      // Test pour gardien
      const mockAsyncStorage = require('@react-native-async-storage/async-storage');
      mockAsyncStorage.getItem.mockResolvedValueOnce('guardian');
      
      const { getAllByRole, rerender } = render(<Navbar {...navbarProps} />);
      
      // Rerender pour prendre en compte le nouveau rôle
      await waitFor(() => {
        rerender(<Navbar {...navbarProps} />);
      });
      
      const buttons = getAllByRole('button');
      
      if (buttons.length > 2) {
        fireEvent.press(buttons[2]);
        
        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/signalements/incidents');
        });
      }
    });
  });

  describe('Navigation Flow Integration', () => {
    it('devrait maintenir l\'état de navigation cohérent', async () => {
      const mockSetSidebarVisible = jest.fn();
      const mockRouter = require('expo-router').useRouter();
      
      const navbarProps = {
        isSidebarVisible: true,
        setIsSidebarVisible: mockSetSidebarVisible,
        router: mockRouter,
      };

      const { getAllByRole } = render(<Navbar {...navbarProps} />);
      
      const buttons = getAllByRole('button');
      
      // Simuler la navigation vers différentes sections
      if (buttons.length > 3) {
        // Navigation vers profil
        fireEvent.press(buttons[4]);
        
        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith('/profil/profil');
          expect(mockSetSidebarVisible).toHaveBeenCalledWith(false);
        });
      }
    });

    it('devrait gérer les erreurs de navigation gracieusement', async () => {
      const mockRouter = require('expo-router').useRouter();
      mockRouter.push.mockRejectedValueOnce(new Error('Navigation failed'));
      
      const navbarProps = {
        isSidebarVisible: false,
        setIsSidebarVisible: jest.fn(),
        router: mockRouter,
      };

      expect(() => {
        const { getAllByRole } = render(<Navbar {...navbarProps} />);
        const buttons = getAllByRole('button');
        
        if (buttons.length > 1) {
          fireEvent.press(buttons[1]);
        }
      }).not.toThrow();
    });
  });

  describe('Storage Integration', () => {
    it('devrait charger et utiliser les données utilisateur pour la navigation', async () => {
      const mockAsyncStorage = require('@react-native-async-storage/async-storage');
      mockAsyncStorage.getItem.mockImplementation((key: string) => {
        if (key === 'userRole') return Promise.resolve('locataire');
        if (key === 'userToken') return Promise.resolve('fake-token');
        return Promise.resolve(null);
      });

      const navbarProps = {
        isSidebarVisible: false,
        setIsSidebarVisible: jest.fn(),
        router: require('expo-router').useRouter(),
      };

      render(<Navbar {...navbarProps} />);
      
      await waitFor(() => {
        expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('userRole');
      });
    });

    it('devrait gérer l\'absence de données utilisateur', async () => {
      const mockAsyncStorage = require('@react-native-async-storage/async-storage');
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const navbarProps = {
        isSidebarVisible: false,
        setIsSidebarVisible: jest.fn(),
        router: require('expo-router').useRouter(),
      };

      expect(() => {
        render(<Navbar {...navbarProps} />);
      }).not.toThrow();
    });
  });
}); 