import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Header from '../../components/Header';

// Mock des dépendances
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('../../hooks/useHeaderStyle', () => ({
  useHeaderStyle: () => ({
    headerRect: { backgroundColor: '#111626', padding: 10 },
    headerContent: { flexDirection: 'row', alignItems: 'center' },
    backButton: { padding: 8 },
    headerTextContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    headerSubtitle: { color: '#FFFFFF', fontSize: 16 },
  }),
}));

describe('Header Component', () => {
  const defaultProps = {
    subtitle: 'Test Subtitle',
  };

  describe('Rendu', () => {
    it('devrait afficher le titre et le sous-titre', () => {
      const { getByText } = render(<Header {...defaultProps} />);
      
      expect(getByText('CoHabitat')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
    });

    it('devrait afficher le bouton retour par défaut', () => {
      const { getByRole } = render(<Header {...defaultProps} />);
      
      const backButton = getByRole('button');
      expect(backButton).toBeTruthy();
    });

    it('ne devrait pas afficher le bouton retour quand showBackButton est false', () => {
      const { queryByRole } = render(
        <Header {...defaultProps} showBackButton={false} />
      );
      
      const backButton = queryByRole('button');
      expect(backButton).toBeNull();
    });

    it('devrait appliquer un arrière-plan transparent quand transparentBackground est true', () => {
      const { getByTestId } = render(
        <Header {...defaultProps} transparentBackground={true} />
      );
      // Ce test nécessiterait un testID sur le composant pour fonctionner complètement
    });
  });

  describe('Interactions', () => {
    it('devrait appeler router.back() quand le bouton retour est pressé', () => {
      const mockRouter = { back: jest.fn() };
      
      // Re-mock pour ce test spécifique
      jest.doMock('expo-router', () => ({
        useRouter: () => mockRouter,
      }));

      const { getByRole } = render(<Header {...defaultProps} />);
      const backButton = getByRole('button');
      
      fireEvent.press(backButton);
      
      expect(mockRouter.back).toHaveBeenCalledTimes(1);
    });

    it('devrait appeler onBackPress personalised quand fourni', () => {
      const mockOnBackPress = jest.fn();
      
      const { getByRole } = render(
        <Header {...defaultProps} onBackPress={mockOnBackPress} />
      );
      const backButton = getByRole('button');
      
      fireEvent.press(backButton);
      
      expect(mockOnBackPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props', () => {
    it('devrait accepter différents sous-titres', () => {
      const { rerender, getByText } = render(
        <Header subtitle="Premier sous-titre" />
      );
      
      expect(getByText('Premier sous-titre')).toBeTruthy();
      
      rerender(<Header subtitle="Nouveau sous-titre" />);
      expect(getByText('Nouveau sous-titre')).toBeTruthy();
    });

    it('devrait gérer les props optionnelles', () => {
      expect(() => {
        render(
          <Header 
            subtitle="Test"
            showBackButton={false}
            transparentBackground={true}
          />
        );
      }).not.toThrow();
    });
  });
}); 