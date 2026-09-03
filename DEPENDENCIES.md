# 📦 Dépendances CoHabitat - Liste Compacte

## 🎯 Frontend (React Native + Expo)

### Core
- **expo** - Plateforme de développement React Native
- **react-native** - Framework mobile cross-platform
- **expo-router** - Navigation basée sur les fichiers
- **react** - Bibliothèque UI

### UI & Styling
- **@expo/vector-icons** - Icônes vectorielles
- **react-native-safe-area-context** - Gestion des zones sécurisées (notch, etc.)
- **react-native-screens** - Optimisation des performances d'écran

### Storage & Data
- **@react-native-async-storage/async-storage** - Stockage local persistant
- **expo-sqlite** - Base de données locale SQLite

### Media & Files
- **expo-image-picker** - Sélection et capture d'images
- **expo-file-system** - Gestion des fichiers
- **expo-media-library** - Accès à la galerie photos

### Networking
- **expo-linking** - Gestion des liens profonds
- **expo-constants** - Variables d'environnement

### Development
- **@types/react** - Types TypeScript pour React
- **@types/react-native** - Types TypeScript pour React Native
- **typescript** - Typage statique

## 🖥️ Backend (Node.js + Express)

### Core
- **express** - Framework web pour API REST
- **node** - Runtime JavaScript

### Database
- **sqlite3** - Base de données SQLite
- **better-sqlite3** - Version améliorée de SQLite

### Authentication & Security
- **jsonwebtoken** - Authentification JWT
- **bcryptjs** - Hachage sécurisé des mots de passe
- **cors** - Gestion Cross-Origin Resource Sharing

### File Handling
- **multer** - Upload et gestion de fichiers
- **path** - Manipulation des chemins de fichiers

### Development
- **nodemon** - Redémarrage automatique en développement
- **dotenv** - Variables d'environnement

## 🛠️ Outils de Développement

### Code Quality
- **eslint** - Analyse statique du code
- **prettier** - Formatage automatique du code

### Testing
- **jest** - Framework de tests
- **@testing-library/react-native** - Tests des composants React Native
- **react-test-renderer** - Rendu de tests React

### Build & Deploy
- **expo-cli** - Outils de développement Expo
- **metro** - Bundler JavaScript pour React Native

## 🎨 Pourquoi ces choix ?

### Frontend
- **Expo** : Simplifie le développement cross-platform
- **TypeScript** : Sécurité de type et meilleure DX
- **AsyncStorage** : Stockage simple et efficace
- **Vector Icons** : Icônes scalables et performantes

### Backend
- **Express** : Framework léger et flexible
- **SQLite** : Base de données embarquée, parfaite pour MVP
- **JWT** : Authentification stateless et sécurisée
- **Multer** : Gestion robuste des uploads

### Architecture
- **API REST** : Standard et facile à maintenir
- **Stockage local** : Performance et respect RGPD
- **Cross-platform** : Une seule base de code pour iOS/Android

---
*Dernière mise à jour : 2025* 