# 🏢 CoHabitat - Gestion Immobilière Intelligente

<div align="center">
  <img src="./assets/images/icon.png" alt="CoHabitat Logo" width="120" height="120">
  
  **Une application mobile moderne pour simplifier la gestion immobilière et améliorer la communication entre gardiens et locataires.**

  ![React Native](https://img.shields.io/badge/React%20Native-0.79-blue?style=flat-square&logo=react)
  ![Expo](https://img.shields.io/badge/Expo-53-black?style=flat-square&logo=expo)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
  ![SQLite](https://img.shields.io/badge/SQLite-Database-blue?style=flat-square&logo=sqlite)
</div>

## 📋 Table des Matières

- [🎯 À propos](#-à-propos)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [📱 Utilisation](#-utilisation)
- [🔧 Configuration](#-configuration)
- [📂 Structure du Projet](#-structure-du-projet)
- [🤝 Contribution](#-contribution)
- [📝 Licence](#-licence)

## 🎯 À propos

CoHabitat est une application mobile native développée avec React Native qui révolutionne la gestion immobilière en créant un pont numérique entre les gardiens d'immeubles et les résidents. Elle permet une communication fluide, un suivi efficace des incidents et une gestion simplifiée des bâtiments.

### 🎯 Objectifs

- **Simplifier** la communication entre gardiens et locataires
- **Centraliser** la gestion des incidents et signalements
- **Optimiser** le suivi des tâches de maintenance
- **Améliorer** l'expérience utilisateur dans la gestion immobilière

## ✨ Fonctionnalités

### 👨‍💼 Espace Gardien

- **🏢 Gestion des bâtiments**
  - Vue d'ensemble des bâtiments assignés
  - Informations détaillées (équipements, règlements)
  - Historique des interventions

- **📋 Gestion des incidents**
  - Tableau de bord des signalements
  - Mise à jour des statuts en temps réel
  - Système de commentaires et historique
  - Notifications push

- **👥 Gestion des locataires**
  - Annuaire des résidents
  - Informations de contact
  - Historique des signalements par locataire

- **📊 Statistiques**
  - Rapport d'activité
  - Métriques de performance
  - Suivi des temps de résolution

### 🏠 Espace Locataire

- **📝 Signalement d'incidents**
  - Formulaire intuitif avec photos
  - Géolocalisation automatique
  - Suivi en temps réel
  - Notifications de mise à jour

- **📱 Suivi des signalements**
  - Historique personnel
  - Statut détaillé des incidents
  - Communication avec le gardien
  - Évaluation des interventions

- **🏢 Informations du bâtiment**
  - Détails techniques
  - Équipements disponibles
  - Règlement intérieur
  - Contacts utiles

- **👨‍🔧 Contact gardien**
  - Informations de contact
  - Horaires de disponibilité
  - Moyens de communication directs

### 🔧 Fonctionnalités communes

- **🔐 Authentification sécurisée**
  - Système JWT
  - Gestion des rôles
  - Récupération de mot de passe

- **📱 Interface responsive**
  - Design adaptatif
  - Mode sombre/clair
  - Accessibilité optimisée

- **🔄 Synchronisation**
  - Données en temps réel
  - Mode hors ligne
  - Synchronisation automatique

## 🛠️ Technologies

### Frontend (Mobile)

- **React Native** `0.79` - Framework mobile cross-platform
- **Expo** `53` - Plateforme de développement
- **TypeScript** `5.0` - Typage statique
- **Expo Router** - Navigation basée sur les fichiers
- **AsyncStorage** - Stockage local
- **Expo Image Picker** - Gestion des photos
- **React Native Safe Area Context** - Gestion des zones sécurisées

### Backend (API)

- **Node.js** `18+` - Runtime JavaScript
- **Express.js** `4.18` - Framework web
- **SQLite** - Base de données
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **Bcryptjs** - Hachage des mots de passe
- **Cors** - Gestion CORS
- **Nodemon** - Développement en temps réel

### Outils de développement

- **ESLint** - Analyse de code
- **Prettier** - Formatage de code
- **Git** - Contrôle de version
- **npm** - Gestionnaire de paquets

## 🏗️ Architecture

```
CoHabitat/
├── 📱 Frontend (React Native + Expo)
│   ├── app/                    # Pages et navigation
│   ├── components/             # Composants réutilisables
│   ├── hooks/                  # Hooks personnalisés
│   ├── config/                 # Configuration
│   └── assets/                 # Images et ressources
│
├── 🖥️ Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # Logique métier
│   │   ├── routes/            # Routes API
│   │   ├── middleware/        # Middlewares
│   │   ├── models/            # Modèles de données
│   │   └── db/                # Base de données
│   └── uploads/               # Fichiers uploadés
│
└── 📄 Documentation
    └── README.md
```

## 🚀 Installation

### Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **Expo CLI** installé globalement
- **Git** ([Télécharger](https://git-scm.com/))

### 1. Cloner le projet

```bash
git clone https://github.com/TomSawyer1/CoHabitat.git
cd CoHabitat
```

### 2. Installer les dépendances

```bash
# Frontend
npm install

# Backend
cd Backend
npm install
cd ..
```

### 3. Configuration (local uniquement)

**Backend** — copier `Backend/.env-exemple` vers `Backend/.env`, puis générer un secret JWT fort :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Coller le résultat dans `Backend/.env` :

```env
JWT_SECRET=<votre_clé_générée>
PORT=3000
NODE_ENV=development
ENABLE_TEST_DATA=true
```

**Frontend** — copier `.env.example` vers `.env` à la racine du projet (PowerShell : `Copy-Item .env.example .env`).

Adapter `EXPO_PUBLIC_API_BASE_URL` selon votre cas (voir [Configuration](#-configuration)).

> Ne jamais commiter `Backend/.env`, `Backend/cohabitat.db` ni `.env`. Voir [SECURITE.md](./SECURITE.md).

### 4. Lancer l'application

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
npm start
```

### 5. Ouvrir l'application

- **Expo Go** : Scanner le QR code avec l'app Expo Go
- **Émulateur Android** : Appuyer sur `a`
- **Simulateur iOS** : Appuyer sur `i`
- **Web** : Appuyer sur `w`



## 🔧 Configuration

CoHabitat est conçu pour tourner **en local** : backend Node sur votre machine + app Expo sur le même réseau (ou émulateur).

L’URL de l’API est lue depuis `.env` à la racine (`EXPO_PUBLIC_API_BASE_URL`), puis exposée via `config/index.ts`.

| Contexte | `EXPO_PUBLIC_API_BASE_URL` |
|----------|----------------------------|
| **Expo Go / simulateur iOS** (PC = serveur) | `http://localhost:3000` |
| **Émulateur Android** | `http://10.0.2.2:3000` |
| **Téléphone physique (Wi‑Fi)** | `http://<IP_du_PC>:3000` (ex. `192.168.1.246`) |

Le PC et le téléphone doivent être sur le **même réseau**. Vérifier que le backend répond : `http://localhost:3000/health`.

### CORS (optionnel)

Par défaut, le backend autorise les origines Expo locales. Pour en ajouter, dans `Backend/.env` :

```env
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,exp://localhost:19000
```

### Documentation complémentaire

- [SECURITE.md](./SECURITE.md) — bonnes pratiques et vérifications
- [AUDIT.md](./AUDIT.md) — rapport technique détaillé

## 📂 Structure du Projet

```
CoHabitat/
├── app/                        # 📱 Pages de l'application
│   ├── auth/                   # Authentification
│   ├── accueil/               # Page d'accueil
│   ├── signalements/          # Gestion des incidents
│   ├── batiments/             # Informations bâtiments
│   └── profil/                # Profil utilisateur
├── components/                 # 🧩 Composants réutilisables
│   ├── Header.tsx             # En-tête global
│   ├── Navbar.tsx             # Navigation
│   └── Sidebar.tsx            # Menu latéral
├── hooks/                      # 🎣 Hooks personnalisés
├── config/                     # ⚙️ Configuration
├── Backend/                    # 🖥️ API Backend
│   ├── src/
│   │   ├── controllers/       # Logique métier
│   │   ├── routes/           # Routes API
│   │   ├── middleware/       # Middlewares
│   │   └── db/               # Base de données
│   └── uploads/              # Fichiers uploadés
└── assets/                     # 🎨 Images et ressources
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Standards de code

- Utilisez **TypeScript** pour tous les nouveaux fichiers
- Suivez les conventions de nommage existantes
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les fonctions complexes

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

<div align="center">
  <p>Développé avec ❤️ pour simplifier la gestion immobilière</p>
  <p>
    <a href="https://github.com/TomSawyer1/CoHabitat/issues">🐛 Signaler un bug</a> •
    <a href="https://github.com/TomSawyer1/CoHabitat/discussions">💬 Discussions</a> •
    <a href="mailto:contact@cohabitat.com">📧 Contact</a>
  </p>
</div>
