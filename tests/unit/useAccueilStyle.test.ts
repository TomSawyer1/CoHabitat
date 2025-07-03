import { renderHook } from '@testing-library/react-native';
import { useAccueilStyle } from '../../hooks/useAccueilStyle';

describe('useAccueilStyle Hook', () => {
  describe('Rendu des styles', () => {
    it('devrait retourner un objet de styles', () => {
      const { result } = renderHook(() => useAccueilStyle());
      
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    });

    it('devrait contenir les styles essentiels', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const styles = result.current;
      
      // Vérifier les styles principaux
      expect(styles.backgroundImage).toBeDefined();
      expect(styles.container).toBeDefined();
      expect(styles.content).toBeDefined();
      expect(styles.headerSection).toBeDefined();
      expect(styles.appTitle).toBeDefined();
      expect(styles.subtitle).toBeDefined();
      expect(styles.description).toBeDefined();
      expect(styles.buttonsSection).toBeDefined();
      expect(styles.primaryButton).toBeDefined();
      expect(styles.secondaryButton).toBeDefined();
    });

    it('devrait avoir des propriétés de style correctes pour backgroundImage', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const { backgroundImage } = result.current;
      
      expect(backgroundImage.flex).toBe(1);
      expect(backgroundImage.resizeMode).toBe('cover');
    });

    it('devrait avoir flex: 1 pour le container principal', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const { container } = result.current;
      
      expect(container.flex).toBe(1);
      expect(container.backgroundColor).toBeDefined();
    });

    it('devrait avoir les bonnes propriétés pour le titre de l\'app', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const { appTitle } = result.current;
      
      expect(appTitle.fontSize).toBe(42);
      expect(appTitle.fontWeight).toBe('bold');
      expect(appTitle.textAlign).toBe('center');
      expect(appTitle.color).toBeDefined();
    });

    it('devrait avoir les bonnes propriétés pour les boutons', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const { button, primaryButton, secondaryButton } = result.current;
      
      // Style de base du bouton
      expect(button.width).toBe('100%');
      expect(button.height).toBe(56);
      expect(button.borderRadius).toBe(16);
      expect(button.alignItems).toBe('center');
      expect(button.justifyContent).toBe('center');
      
      // Bouton primaire
      expect(primaryButton.backgroundColor).toBeDefined();
      
      // Bouton secondaire
      expect(secondaryButton.backgroundColor).toBeDefined();
      expect(secondaryButton.borderWidth).toBe(2);
      expect(secondaryButton.borderColor).toBeDefined();
    });
  });

  describe('Cohérence des styles', () => {
    it('devrait utiliser des couleurs cohérentes', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const styles = result.current;
      
      // Vérifier que les couleurs sont définies et non nulles
      expect(styles.appTitle.color).toBeTruthy();
      expect(styles.subtitle.color).toBeTruthy();
      expect(styles.description.color).toBeTruthy();
      expect(styles.primaryButton.backgroundColor).toBeTruthy();
      expect(styles.secondaryButton.backgroundColor).toBeTruthy();
    });

    it('devrait avoir des espacements cohérents', () => {
      const { result } = renderHook(() => useAccueilStyle());
      const { content, headerSection, buttonsSection } = result.current;
      
      expect(content.paddingHorizontal).toBeDefined();
      expect(content.paddingTop).toBeDefined();
      expect(content.paddingBottom).toBeDefined();
      
      expect(headerSection.marginBottom).toBe(50);
      expect(buttonsSection.gap).toBe(16);
    });
  });

  describe('Stabilité', () => {
    it('devrait retourner les mêmes styles à chaque appel', () => {
      const { result, rerender } = renderHook(() => useAccueilStyle());
      const firstStyles = result.current;
      
      rerender();
      const secondStyles = result.current;
      
      // Les objets peuvent être différents mais devraient avoir les mêmes propriétés
      expect(JSON.stringify(firstStyles)).toBe(JSON.stringify(secondStyles));
    });

    it('ne devrait pas lancer d\'erreur', () => {
      expect(() => {
        renderHook(() => useAccueilStyle());
      }).not.toThrow();
    });
  });
}); 