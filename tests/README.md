# 🧪 Tests GuardConnect

Ce dossier contient tous les tests pour l'application mobile GuardConnect (anciennement CoHabitat). La stratégie de tests couvre les tests unitaires et d'intégration pour assurer la qualité et la fiabilité de l'application.

## 📁 Structure des tests

```
tests/
├── unit/              # Tests unitaires (composants, hooks, utilitaires)
│   ├── Header.test.tsx
│   ├── navbar.test.tsx
│   ├── sidebar.test.tsx
│   ├── config.test.ts
│   ├── useAccueilStyle.test.ts
│   └── useColorScheme.test.ts
├── integration/       # Tests d'intégration (flux, navigation, API)
│   ├── navigation.test.tsx
│   ├── auth-flow.test.tsx
│   └── data-flow.test.tsx
└── README.md         # Cette documentation
```

## 🛠️ Technologies utilisées

- **Jest** : Framework de tests principal
- **@testing-library/react-native** : Utilitaires de test pour React Native
- **@types/jest** : Types TypeScript pour Jest
- **react-test-renderer** : Rendu des composants pour les tests

## 🚀 Lancement des tests

### Commandes principales

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch (redémarrage automatique)
npm run test:watch

# Lancer les tests avec rapport de couverture
npm run test:coverage

# Lancer uniquement les tests unitaires
npm run test:unit

# Lancer uniquement les tests d'intégration
npm run test:integration
```

### Commandes Jest avancées

```bash
# Lancer un fichier de test spécifique
npm test -- Header.test.tsx

# Lancer les tests avec un pattern spécifique
npm test -- --testNamePattern="Navigation"

# Mode verbose pour plus de détails
npm test -- --verbose

# Lancer les tests en parallèle (par défaut)
npm test -- --maxWorkers=4
```

## 📊 Couverture de code

La configuration Jest est réglée pour collecter automatiquement la couverture de code avec les seuils suivants :

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

Les fichiers couverts incluent :
- `app/**/*.{ts,tsx,js,jsx}`
- `components/**/*.{ts,tsx,js,jsx}`
- `hooks/**/*.{ts,tsx,js,jsx}`
- `config/**/*.{ts,tsx,js,jsx}`

Les dossiers exclus :
- `node_modules/`
- `**/__tests__/**`
- `**/tests/**`
- `**/*.d.ts`

## 🧪 Types de tests

### Tests unitaires (`tests/unit/`)

Les tests unitaires testent des composants ou fonctions isolés :

#### Composants UI
- **Header.test.tsx** : Test du composant d'en-tête
  - Rendu correct du titre et sous-titre
  - Fonctionnement du bouton retour
  - Gestion des props optionnelles

- **navbar.test.tsx** : Test de la barre de navigation
  - Affichage des éléments de navigation
  - Interactions utilisateur
  - États visuels selon l'index actif

- **sidebar.test.tsx** : Test de la barre latérale
  - Ouverture/fermeture de la sidebar
  - Navigation vers les différentes sections
  - Chargement du rôle utilisateur

#### Hooks personnalisés
- **useAccueilStyle.test.ts** : Test du hook de styles d'accueil
  - Retour des styles corrects
  - Propriétés CSS appropriées
  - Cohérence des couleurs

- **useColorScheme.test.ts** : Test du hook de détection de thème
  - Détection des thèmes clair/sombre
  - Gestion des valeurs par défaut
  - Stabilité entre les renders

#### Configuration et utilitaires
- **config.test.ts** : Test de la configuration API
  - Validation des URLs
  - Détection de plateforme
  - Gestion des variables d'environnement

### Tests d'intégration (`tests/integration/`)

Les tests d'intégration testent les interactions entre composants :

#### Navigation
- **navigation.test.tsx** : Test des flux de navigation
  - Navigation entre écrans
  - Gestion de l'état de la sidebar
  - Navigation selon le rôle utilisateur

#### Authentification
- **auth-flow.test.tsx** : Test du processus d'authentification
  - Stockage et récupération des tokens
  - Appels API d'authentification
  - Gestion des rôles utilisateur
  - Persistance de session

#### Flux de données
- **data-flow.test.tsx** : Test des flux de données
  - Chargement des données utilisateur
  - Synchronisation avec l'API
  - Gestion du cache
  - Gestion d'erreurs

## 🔧 Configuration

### Jest (`jest.config.js`)

La configuration Jest est optimisée pour React Native avec Expo :

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 }
  }
  // ... autres configurations
};
```

### Setup Jest (`jest.setup.js`)

Le fichier de setup configure les mocks globaux :

- Mocks d'Expo (router, constants, status-bar, etc.)
- Mock d'AsyncStorage
- Mock des icônes
- Mock de fetch global
- Configuration des timers

## 📝 Conventions de test

### Nommage des fichiers
- Tests unitaires : `nomComposant.test.tsx` ou `nomHook.test.ts`
- Tests d'intégration : `nom-fonctionnalite.test.tsx`

### Structure des tests
```typescript
describe('Nom du composant/hook/fonctionnalité', () => {
  describe('Catégorie de tests', () => {
    it('devrait faire quelque chose de spécifique', () => {
      // Test code
    });
  });
});
```

### Descriptions en français
Tous les tests utilisent des descriptions en français pour une meilleure lisibilité :
- `describe('Navigation Integration Tests', () => ...)`
- `it('devrait naviguer vers l\'accueil', () => ...)`

## 🔄 Mocks et dépendances

### Mocks automatiques
Les mocks suivants sont configurés globalement dans `jest.setup.js` :

```typescript
// Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() })
}));

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

// Icônes
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));
```

### Mocks spécifiques aux tests
Chaque fichier de test peut définir ses propres mocks pour des besoins spécifiques.

## 🐛 Débogage des tests

### Tests qui échouent
```bash
# Lancer un test spécifique en mode verbose
npm test -- --testNamePattern="Header" --verbose

# Afficher tous les console.log dans les tests
npm test -- --silent=false
```

### Problèmes courants

1. **Mocks manquants** : Vérifiez que tous les modules externes sont mockés
2. **Timers** : Utilisez `jest.useFakeTimers()` pour les setTimeout/setInterval
3. **Async/Await** : N'oubliez pas `await waitFor()` pour les opérations async

## 📈 Métriques et reporting

### Rapport de couverture
Après `npm run test:coverage`, consultez le dossier `coverage/` :
- `coverage/lcov-report/index.html` : Rapport HTML détaillé
- `coverage/lcov.info` : Données pour les outils CI/CD

### CI/CD Integration
Les tests peuvent être intégrés dans une pipeline CI/CD :

```yaml
# Exemple GitHub Actions
- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

## 🎯 Objectifs de qualité

- ✅ **Couverture** : Maintenir >70% de couverture sur tous les indicateurs
- ✅ **Performance** : Tests rapides (<30s pour la suite complète)
- ✅ **Maintenabilité** : Tests lisibles et bien organisés
- ✅ **Fiabilité** : Tests déterministes sans flakiness

## 🚀 Ajout de nouveaux tests

### Pour un nouveau composant :
1. Créer `tests/unit/NouveauComposant.test.tsx`
2. Tester le rendu, les props, les interactions
3. Mocker les dépendances externes

### Pour une nouvelle fonctionnalité :
1. Créer `tests/integration/nouvelle-fonctionnalite.test.tsx`
2. Tester le flux complet end-to-end
3. Inclure les cas d'erreur

### Guidelines :
- Tester les comportements, pas l'implémentation
- Préférer les queries `getByRole`, `getByText` aux `getByTestId`
- Mocker les dépendances externes (API, storage, navigation)
- Écrire des assertions claires et spécifiques

---

## 🔗 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing React Native with Jest](https://reactnative.dev/docs/testing-overview)

---

**💡 Conseil** : Lancez `npm run test:watch` pendant le développement pour avoir un feedback immédiat sur vos modifications ! 