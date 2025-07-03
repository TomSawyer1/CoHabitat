import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '../../hooks/useColorScheme';

// Mock de react-native
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}));

describe('useColorScheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Détection du thème', () => {
    it('devrait retourner le thème par défaut', () => {
      const { result } = renderHook(() => useColorScheme());
      
      expect(result.current).toBeDefined();
      expect(['light', 'dark']).toContain(result.current);
    });

    it('devrait détecter le thème sombre', () => {
      const mockAppearance = require('react-native').Appearance;
      mockAppearance.getColorScheme.mockReturnValue('dark');
      
      const { result } = renderHook(() => useColorScheme());
      
      expect(result.current).toBe('dark');
    });

    it('devrait détecter le thème clair', () => {
      const mockAppearance = require('react-native').Appearance;
      mockAppearance.getColorScheme.mockReturnValue('light');
      
      const { result } = renderHook(() => useColorScheme());
      
      expect(result.current).toBe('light');
    });

    it('devrait gérer un thème non défini', () => {
      const mockAppearance = require('react-native').Appearance;
      mockAppearance.getColorScheme.mockReturnValue(null);
      
      const { result } = renderHook(() => useColorScheme());
      
      // Devrait fallback vers 'light' par défaut
      expect(['light', 'dark']).toContain(result.current);
    });
  });

  describe('Stabilité du hook', () => {
    it('ne devrait pas lancer d\'erreur', () => {
      expect(() => {
        renderHook(() => useColorScheme());
      }).not.toThrow();
    });

    it('devrait être stable entre les renders', () => {
      const { result, rerender } = renderHook(() => useColorScheme());
      const firstTheme = result.current;
      
      rerender();
      const secondTheme = result.current;
      
      // Si le thème système n'a pas changé, devrait être identique
      expect(firstTheme).toBe(secondTheme);
    });
  });
}); 