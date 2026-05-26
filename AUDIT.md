# 🔍 CoHabitat — Rapport d'Audit du Projet

> **Date de l'audit :** 26 mai 2026
> **Périmètre :** scan complet du dépôt (`app/`, `components/`, `hooks/`, `config/`, `Backend/`, configuration, sécurité).
> **Objectif :** dresser un état des lieux honnête de ce qui fonctionne et de ce qui pose problème, pour servir de base à la roadmap.

---

## 📋 Table des matières

- [1. Présentation rapide](#1-présentation-rapide)
- [2. Stack technique réelle (vs annoncée)](#2-stack-technique-réelle-vs-annoncée)
- [3. ✅ Ce qui va bien](#3--ce-qui-va-bien)
- [4. ❌ Ce qui ne va pas](#4--ce-qui-ne-va-pas)
  - [4.1 Sécurité (critique)](#41-sécurité-critique)
  - [4.2 Bugs backend](#42-bugs-backend)
  - [4.3 Bugs frontend / Expo](#43-bugs-frontend--expo)
  - [4.4 Base de données](#44-base-de-données)
  - [4.5 Qualité de code, tests, DX](#45-qualité-de-code-tests-dx)
  - [4.6 Configuration & déploiement](#46-configuration--déploiement)
  - [4.7 Documentation & légal](#47-documentation--légal)
- [5. 🚦 Priorités recommandées](#5--priorités-recommandées)
- [6. 📂 Structure réelle du projet](#6--structure-réelle-du-projet)
- [7. TL;DR](#7-tldr)

---

## 1. Présentation rapide

CoHabitat est une application **React Native / Expo** accompagnée d'une **API Express + SQLite** pour gérer la communication entre **locataires** et **gardiens** d'immeubles : signalement d'incidents (avec photo), suivi par statut, commentaires, historique, gestion du bâtiment et du profil.

Le projet est **fonctionnel sur le papier** (les principaux parcours sont câblés), mais il contient **plusieurs bugs bloquants**, des **fuites de secrets dans Git**, et un **gros écart entre le README et la réalité du code**.

---

## 2. Stack technique réelle (vs annoncée)

| Élément | Annoncé (README) | Réel (`package.json`) |
|---|---|---|
| React Native | `0.74` | **`0.79.2`** |
| Expo | `51` | **`^53.0.12`** |
| React | non précisé | **`^19.1.0`** |
| TypeScript | `5.0` | **`~5.8.3`** |
| Backend | Node 18+, Express 4.18, SQLite, JWT, Multer | ✅ Conforme (`sqlite3`, `express`, `jsonwebtoken`, `multer`, `zod`, `bcryptjs`) |
| Tests | "Ajoutez des tests" | **Aucun test** (cf. §4.5) |
| Mode sombre | "Mode sombre/clair" | **Non implémenté** (cf. §4.3) |
| Notifications push | "Notifications push" | **Non implémentées** (aucune lib `expo-notifications`) |

➡️ Le `app.json` déclare aussi `"runtimeVersion": "50.0.0"` alors que le SDK Expo installé est **53** : à corriger sinon les OTA seront bancales.

---

## 3. ✅ Ce qui va bien

- **Architecture séparée et lisible** : frontend Expo Router (file-based) + backend Express modulaire (`routes/ → controllers/ → db/`).
- **Authentification JWT** opérationnelle pour locataires et gardiens, avec rôle stocké dans le token et la réponse de login.
- **Hash `bcryptjs`** systématique avant insertion en BDD (10 rounds).
- **Upload d'images** via `multer` propre : dossier `uploads/` auto-créé, limite 5 Mo, filtre MIME (jpeg/png/gif/webp).
- **Validation Zod** sur les incidents (création + update) — bon réflexe à généraliser au reste.
- **Système d'historique + commentaires** d'incidents bien modélisé (`incident_history`, `incident_comments`).
- **Brouillon AsyncStorage** sur le formulaire de signalement (`signalement.tsx`) : la saisie n'est jamais perdue.
- **Gestion CORS** explicite avec une liste d'origines (à dépoussiérer mais l'idée est là).
- **Migration SQLite douce** pour ajouter la colonne `title` à `incidents` si elle manque (cf. `database.js`).
- **Route `/health`** + `/api/info` exposées pour le monitoring.
- **Données de seed** (`Résidence Les Alpes`, etc.) injectées si la table `batiments` est vide → l'app est utilisable dès le premier `npm run dev`.
- **Bonne séparation des styles** : chaque écran a son hook dédié (`useLoginStyle`, `useHomeStyle`, …) → factorisation propre.
- **Header, Navbar, Sidebar** réutilisables, navigation adaptée au rôle (locataire vs gardien).
- **`.env-exemple`** très bien documenté (commentaires, génération de secret, valeurs par défaut).

---

## 4. ❌ Ce qui ne va pas

### 4.1 Sécurité (critique)

| # | Problème | Fichier / preuve | Impact |
|---|---|---|---|
| S1 | **`Backend/.env` est versionné dans Git** (`git ls-files` le confirme) → la clé JWT de production `JWT_SECRET=T~[&(UGx~"^Y,SSh|Z0!Kwui'#pS{WcD` est **publique**. | `Backend/.env` | 🔴 Critique |
| S2 | **`Backend/cohabitat.db` est versionné** → toutes les données locales (comptes de test, emails, hash bcrypt) sont dans le dépôt. | `Backend/cohabitat.db` | 🔴 Critique |
| S3 | **Secret JWT en clair en fallback** dans le code : `process.env.JWT_SECRET \|\| 'cohabitat_secret_key_2024'`. En l'absence d'`.env`, l'app tourne quand même avec une clé connue. | `Backend/src/controllers/authController.js:5`, `Backend/src/middleware/auth.js:3` | 🔴 Critique |
| S4 | **Le secret JWT est loggué en console** à chaque requête authentifiée. | `Backend/src/middleware/auth.js:16` — `console.log('Clé secrète utilisée…', JWT_SECRET);` | 🔴 Critique |
| S5 | **Le `req.body` est loggué entier** → les **mots de passe en clair** apparaissent dans les logs serveur et dans les logs d'inscription/connexion. | `Backend/src/app.js:33-41`, `authController.js:8/55` | 🔴 Critique |
| S6 | **Aucun rate limiting** sur `/auth/login` ni `/auth/register/*` → brute force trivial. | absence de `express-rate-limit` | 🟠 Élevé |
| S7 | **Aucune en-tête de sécurité** : pas de `helmet`, pas de CSP, pas de HSTS. | `Backend/src/app.js` | 🟠 Élevé |
| S8 | **CORS très permissif** (`credentials: true` + liste contenant `localhost:*` et une URL Railway hardcodée). | `Backend/src/app.js:18-27` | 🟡 Moyen |
| S9 | **Le token JWT est stocké dans `AsyncStorage`** non chiffré (acceptable côté mobile mais à signaler ; sur Web il devient `localStorage`, donc vulnérable XSS). | tous les écrans `auth/*.tsx` | 🟡 Moyen |
| S10 | **Aucune politique de mot de passe forte** côté serveur (8 caractères mini, mais aucune complexité, aucune liste noire). | `authController.js:387` | 🟡 Moyen |

➡️ **Action immédiate :** révoquer la clé JWT actuelle, purger l'historique Git (`git filter-repo` / BFG), régénérer un secret, retirer la BDD du dépôt.

---

### 4.2 Bugs backend

| # | Bug | Fichier | Conséquence |
|---|---|---|---|
| B1 | **`getBuildingResidents` utilise `building_id`** alors que la colonne réelle est `batiments_id` dans `guardians` et `locataire`. | `Backend/src/controllers/authController.js:529, 549` | Route `GET /auth/buildings/:buildingId/residents` totalement cassée. |
| B2 | **`getIncidentStats` référence la colonne `priority`** qui n'existe pas dans la table `incidents`. | `Backend/src/controllers/incidentController.js:423` | `GET /api/incidents/stats` retourne une erreur SQL 500. |
| B3 | **Route `/api/incidents/stats` masquée** par `/api/incidents/:id` (déclarée avant). | `Backend/src/routes/incidentsRoutes.js:24` puis `:31` | L'endpoint stats est **inatteignable** : Express le matche comme `id="stats"`. |
| B4 | **Catch-all `app.use('*', …)`** : syntaxe à risque si Express passe en v5 (`path-to-regexp` v6+ rejette `'*'`). | `Backend/src/app.js:82` | À surveiller lors d'un upgrade. |
| B5 | **`registerGuardian` ne gère pas le doublon `guardian_number`** (UNIQUE en BDD) → renvoie un 500 générique au lieu d'un 409. | `Backend/src/controllers/authController.js:35-46` | UX dégradée à l'inscription. |
| B6 | **Validation Zod absente sur `/auth/*`** : `login`, `register/*`, `change-password`, `profile/*` se contentent de `if (!champ)`. | `Backend/src/controllers/authController.js` | Pas de format email, pas de longueur, pas de typage strict. |
| B7 | **Aucun contrôle d'autorisation** sur `getLocataireInfo` / `getGuardianInfo` (`/auth/locataire/:id`, `/auth/guardian/:id`) — **routes non protégées par `auth`** dans `authRoutes.js`. | `Backend/src/routes/authRoutes.js:23-24` | N'importe qui peut lire le profil de n'importe quel utilisateur, y compris email, téléphone et `id_batiment`. |
| B8 | **`getBuildingInfo`** prend `:userId` en paramètre URL mais ne vérifie pas que `req.user.id === userId` → un locataire peut lire le bâtiment d'un autre. | `Backend/src/controllers/buildingController.js:20-32` | Fuite horizontale d'info. |
| B9 | **`telephone_securite` lu en BDD** alors que la colonne n'existe pas dans `batiments`. | `Backend/src/controllers/buildingController.js:91` | Renverra toujours "Non disponible" → code mort. |
| B10 | **Aucune gestion explicite des erreurs Multer non-MulterError** : l'image est ignorée silencieusement si la requête est mal formée. | `Backend/src/middleware/upload.js` | À renforcer. |

---

### 4.3 Bugs frontend / Expo

| # | Bug | Fichier | Conséquence |
|---|---|---|---|
| F1 | **`Stack.Screen name="profil/mon-gardien"`** alors que le fichier réel est `app/batiments/mon-gardien.tsx`. | `app/_layout.tsx:31` | Déclaration de route inutile/incohérente. |
| F2 | **`app/accueil/home.tsx` est vide** : `<View>{/* Votre contenu ira ici */}</View>`. C'est pourtant **la page d'accueil après login**. | `app/accueil/home.tsx:41` | L'utilisateur connecté tombe sur une page blanche. |
| F3 | **`app/auth/forgot-password.tsx` est un mock** : `handleSubmit` ne fait que `console.log`, aucun appel API. | `app/auth/forgot-password.tsx:22-28` | Fonctionnalité annoncée mais inopérante. |
| F4 | **~95 lignes de styles morts** (un `StyleSheet.create` complet) dans `gardian-login.tsx`, écrasés à l'exécution par `useGardianLoginStyle()`. | `app/auth/gardian-login.tsx:184-277` | Maintenance et taille bundle inutiles. |
| F5 | **`testButtonPress` orphelin** dans `register.tsx` (jamais appelé). | `app/auth/register.tsx:151-154` | Code mort. |
| F6 | **`ImagePicker.MediaTypeOptions.Images` déprécié** depuis expo-image-picker v15 (SDK 51+). | `app/signalements/signalement.tsx:395, 420` | Warning console + suppression future. |
| F7 | **`useColorScheme` existe** mais n'est jamais utilisé : `_layout.tsx` fixe `DefaultTheme`. | `hooks/useColorScheme.ts` vs `app/_layout.tsx:14` | Le "mode sombre/clair" annoncé n'existe pas. |
| F8 | **Aucun `SafeAreaProvider`** dans `_layout.tsx` alors que `Header`/`Navbar` utilisent `useSafeAreaInsets`. | `app/_layout.tsx` | Fonctionne par défaut en `react-native-safe-area-context` v5, mais fragile. |
| F9 | **`favicon.png` référencé** dans `app.json` (`./assets/images/favicon.png`) mais le fichier **n'existe pas**. | `app.json:22` vs `assets/images/` | Le build Web échouera. |
| F10 | **`runtimeVersion: "50.0.0"`** alors que le SDK installé est 53. | `app.json:33` | OTA / EAS Update incohérent. |
| F11 | **Aucune permission native** déclarée dans `app.json` pour `Camera` / `MediaLibrary` alors que `expo-image-picker` les utilise. | `app.json` | Build iOS échouera sans `NSCameraUsageDescription`. |
| F12 | **`incidentsData` (données fictives)** laissé dans `profil.tsx` sans être utilisé. | `app/profil/profil.tsx:22-45` | Code mort. |
| F13 | **`saveDraftData` sans debounce** : déclenché à chaque frappe sur 4 champs → écritures AsyncStorage en rafale. | `app/signalements/signalement.tsx:60-64` | Perfo et usure stockage. |
| F14 | **Sidebar incohérente** : l'item *"Rapports"* (id 4) redirige vers `/signalements/gerer-incidents`. | `components/sidebar.tsx:119-120` | UX trompeuse. |
| F15 | **`parametres.tsx` ne fait que basculer une string** "Français/Anglais" en local, sans i18n. | `app/profil/parametres.tsx:25-29` | Mock visuel. |
| F16 | **Aucune gestion d'expiration JWT** côté client : pas de refresh, pas de redirection automatique sur 401 globale. Chaque écran le gère à la main. | tous | Sessions cassées silencieusement après 24 h. |
| F17 | **`Dimensions` et `sidebarWidth`** importés/déclarés mais non utilisés dans `signalement.tsx` et `suivresignal.tsx`. | `signalement.tsx:26-27`, `suivresignal.tsx:25-26` | Code mort. |
| F18 | **`alert()` natif (web)** utilisé au lieu de `Alert.alert` dans la sidebar → ne marche pas en natif. | `components/sidebar.tsx:54` | Léger mais à uniformiser. |

---

### 4.4 Base de données

- **`cohabitat.db` versionné** → cf. §4.1 (S2).
- **Aucun système de migration** (Knex, Prisma, Drizzle…) : le schéma vit dans `database.js` et est patché à coup de `PRAGMA table_info` + `ALTER TABLE`.
- **Pas d'index** sur les FK (`idBatiment`, `idUtilisateur`, `assigned_guardian_id`, `batiments_id`) → requêtes lentes dès quelques milliers de lignes.
- **Pas de contrainte `ON DELETE CASCADE`** : supprimer un utilisateur laisse des incidents/commentaires/historique orphelins, parfois avec FK invalide.
- **Deux tables d'utilisateurs distinctes** (`locataire` et `guardians`) → toutes les jointures par rôle sont dupliquées et fragiles ; une table `users` + `role` aurait été plus simple.
- **`equipements` stocké en JSON** dans une colonne TEXT → pas requêtable, pas validé.
- **`date` de l'incident en TEXT** (`"20/10/2023 14:30"`) au lieu de `DATETIME` → impossible à trier proprement.

---

### 4.5 Qualité de code, tests, DX

- **Aucun test** : `package.json` déclare `jest`, `jest-expo`, `babel-jest`, et **4 scripts npm** (`test`, `test:watch`, `test:coverage`, `test:unit`, `test:integration`), mais :
  - aucun dossier `tests/` ni `__tests__/`,
  - aucun fichier `*.test.*`,
  - aucune config `jest` dans `package.json`.
  Tous les scripts test crashent.
- **`tsconfig.json` cassé** :
  - `include` contient `"/*.ts"`, `"/.tsx"` et `".expo/types/**/.ts"` (au lieu de `**/*.ts`, `**/*.tsx`),
  - `paths` mappe `"@/"` → `["./"]` au lieu de `"@/*": ["./*"]` → alias inutilisable.
- **`strict: true`** activé mais le code utilise des `any` un peu partout (`buildings: any[]`, `formData.image as any`).
- **Logs verbeux en production** : le middleware Express logge **tous les headers + body** de chaque requête, et chaque controller a 5-10 `console.log` informatifs.
- **Convention de nommage mélangée** : `Header.tsx`, `Sidebar.tsx`, `navbar.tsx` (minuscule) côte-à-côte ; `idUtilisateur`/`idBatiment` (camel) vs `batiments_id`/`assigned_guardian_id` (snake) dans la même BDD.
- **`Backend/package.json`** : `name`, `description`, `author` vides ; script `test` factice (`echo "Error: no test specified" && exit 1`).
- **Pas de `engines`** (Node version), pas de `prettier`, pas de hook `pre-commit`.
- **Le `README.md` racine ment** sur la stack (Expo 51 / RN 0.74) — c'est ce document qui corrige.

---

### 4.6 Configuration & déploiement

- **URL Railway hardcodée** dans la liste CORS (`zoological-growth.up.railway.app`). À passer en `process.env.CORS_ORIGINS`.
- **Aucun `Dockerfile`**, aucun `docker-compose.yml`, aucun pipeline CI/CD (`.github/workflows/` absent).
- **Aucun reverse-proxy / HTTPS** documenté — le `.env-exemple` recommande HTTPS en prod mais rien n'est outillé.
- **Pas de séparation `dev` / `prod`** : un seul `app.js`, pas de profil Zod différent, pas de niveau de log configurable.
- **Le `app.json` n'a pas de configuration EAS** (`eas.json` absent) → builds OTA / store non outillés.
- **Web non testable** tant que `favicon.png` n'est pas fourni (cf. F9).

---

### 4.7 Documentation & légal

- **`LICENSE` absent** alors que le `README.md` mentionne "MIT".
- **Pas de `CONTRIBUTING.md`**, pas de `CHANGELOG.md`, pas de modèle d'issue / PR (`.github/` absent).
- **Pas de doc API** (OpenAPI/Swagger) — la liste d'endpoints est codée en dur dans le 404 d'`app.js`, et c'est tout.
- **`Backend/` n'a pas de README** — un nouveau développeur doit lire le code pour comprendre les routes.
- **`Doc annex/`** contient 3 PDFs (Cahier des charges, Business Model, Présentation) — non référencés depuis le README.

---

## 5. 🚦 Priorités recommandées

> Ordonnées par **risque × effort** :

### 🔴 P0 — À faire avant toute mise en ligne

1. **Sortir `Backend/.env` et `Backend/cohabitat.db` du dépôt** :
   - `git rm --cached Backend/.env Backend/cohabitat.db`
   - réécrire l'historique (BFG / `git filter-repo`) et **forcer la rotation du `JWT_SECRET`**.
2. **Supprimer les `console.log` de secrets et mots de passe** (`auth.js:16`, `app.js:33-41`, `authController.js:8,55`).
3. **Faire planter le démarrage si `JWT_SECRET` n'est pas défini** (au lieu du fallback en clair).
4. **Protéger `/auth/locataire/:id` et `/auth/guardian/:id`** avec `auth` + check `req.user.id === :id`.
5. **Corriger `getBuildingResidents`** (`building_id` → `batiments_id`).
6. **Corriger `getIncidentStats`** (supprimer la colonne `priority` ou l'ajouter) **et** réordonner les routes pour que `/incidents/stats` passe **avant** `/incidents/:id`.

### 🟠 P1 — À faire dans la foulée

7. Ajouter `helmet`, `express-rate-limit` (au moins sur `/auth/login`), CORS depuis env.
8. Valider toutes les entrées auth avec Zod (email, longueur, complexité mdp).
9. Remplacer `ImagePicker.MediaTypeOptions.Images` par `['images']`.
10. Ajouter `favicon.png` (ou retirer la référence) **et** déclarer les permissions iOS dans `app.json`.
11. Aligner `runtimeVersion` sur SDK 53 dans `app.json`.
12. Implémenter vraiment **`forgot-password`** ou retirer le bouton.
13. Remplir **`/accueil/home`** (page blanche aujourd'hui).
14. Corriger le `tsconfig.json` (`include`, `paths`).

### 🟡 P2 — Dette structurelle

15. Mettre en place **migrations** (Drizzle/Knex) + index BDD + `ON DELETE CASCADE`.
16. Mettre en place **au moins quelques tests** Jest (login, création incident, validation Zod).
17. Ajouter un **intercepteur fetch global** côté front pour gérer expiration JWT + logout auto.
18. Centraliser **les types TS** entre back et front (un fichier `types/api.ts` partagé).
19. Ajouter **i18n** (`expo-localization` + `i18next`) — actuellement, `parametres.tsx` ne fait que basculer un label.
20. Documenter l'API en **OpenAPI** (`swagger-jsdoc` + `swagger-ui-express`).
21. Ajouter `LICENSE`, `CONTRIBUTING.md`, `eas.json`, un `Dockerfile`, et une CI GitHub Actions minimale (`lint` + `tsc --noEmit`).

---

## 6. 📂 Structure réelle du projet

```
CoHabitat/
├── app/                                # Expo Router (file-based)
│   ├── _layout.tsx                     # Stack racine (⚠️ pas de SafeAreaProvider, pas de ColorScheme)
│   ├── index.tsx                       # Splash + redirection /accueil
│   ├── +not-found.tsx
│   ├── accueil/
│   │   ├── index.tsx                   # Landing public (locataire / gardien)
│   │   └── home.tsx                    # ⚠️ Page d'accueil connectée VIDE
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx                # ⚠️ contient testButtonPress mort
│   │   ├── gardian-login.tsx           # ⚠️ ~95 lignes de styles morts
│   │   ├── gardian-register.tsx
│   │   ├── forgot-password.tsx         # ⚠️ mock, aucune API
│   │   └── splash.tsx
│   ├── signalements/
│   │   ├── index.tsx                   # redirige vers /signalement
│   │   ├── signalement.tsx             # création (locataire)
│   │   ├── suivresignal.tsx            # suivi (locataire)
│   │   ├── incidents.tsx               # liste (les deux rôles)
│   │   └── gerer-incidents.tsx         # gestion (gardien)
│   ├── batiments/
│   │   ├── batiments.tsx               # ⚠️ données fictives en dur
│   │   ├── mon-batiment.tsx
│   │   └── mon-gardien.tsx
│   └── profil/
│       ├── profil.tsx                  # ⚠️ incidentsData morte
│       └── parametres.tsx              # ⚠️ pas d'i18n réelle
│
├── components/
│   ├── Header.tsx
│   ├── navbar.tsx                      # ⚠️ casse irrégulière
│   └── sidebar.tsx
│
├── hooks/                              # 1 hook par écran/composant (styles)
│   ├── useColorScheme.ts               # ⚠️ jamais consommé
│   └── …
│
├── config/
│   └── index.ts                        # API_BASE_URL + fallback plateforme
│
├── Backend/
│   ├── server.js                       # boot
│   ├── src/
│   │   ├── app.js                      # ⚠️ logs body/headers entiers
│   │   ├── db/database.js              # création + migration ad-hoc
│   │   ├── middleware/
│   │   │   ├── auth.js                 # ⚠️ logge le JWT_SECRET
│   │   │   └── upload.js
│   │   ├── controllers/
│   │   │   ├── authController.js       # ⚠️ getBuildingResidents cassé
│   │   │   ├── buildingController.js   # ⚠️ telephone_securite inexistant
│   │   │   └── incidentController.js   # ⚠️ priority inexistant
│   │   └── routes/
│   │       ├── authRoutes.js           # ⚠️ /locataire/:id et /guardian/:id non protégés
│   │       ├── buildingRoutes.js
│   │       └── incidentsRoutes.js      # ⚠️ /stats masqué par /:id
│   ├── uploads/                        # gitignored
│   ├── cohabitat.db                    # ⚠️ versionné par erreur
│   └── .env                            # ⚠️ versionné par erreur
│
├── assets/
│   └── images/                         # ⚠️ favicon.png référencé mais absent
│
├── Doc annex/                          # PDFs (cahier des charges, BMC, présentation)
├── app.json                            # ⚠️ runtimeVersion 50 / SDK 53
├── tsconfig.json                       # ⚠️ include + paths cassés
├── eslint.config.js
├── babel.config.js
├── metro.config.js
└── package.json                        # ⚠️ scripts test sans tests
```

---

## 7. TL;DR

> **CoHabitat est un projet bien structuré au niveau visuel et UX**, avec une **architecture front/back claire** et plusieurs idées solides (Zod, brouillons AsyncStorage, JWT par rôle, historique d'incidents).
>
> **Mais il n'est pas prêt pour la production** : la clé JWT et la base SQLite sont publiques sur GitHub, plusieurs routes serveur sont cassées (`getBuildingResidents`, `getIncidentStats`, `/incidents/stats`), la page d'accueil connectée est vide, le mot de passe oublié est un mock, et il n'y a **aucun test** malgré la promesse du `package.json`.
>
> **Avant publication, traiter au minimum les points P0 du §5.**
