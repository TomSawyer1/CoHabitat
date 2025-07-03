# CoHabitat - Votre application de gestion immobilière simplifiée

Bienvenue sur CoHabitat, l'application mobile conçue pour optimiser la communication et la gestion au sein des bâtiments. Que vous soyez un gardien soucieux de l'entretien de son bâtiment ou un locataire souhaitant accéder rapidement aux informations importantes, CoHabitat est là pour vous faciliter la vie.

## À quoi sert CoHabitat ?

CoHabitat vise à créer un pont numérique entre les gardiens d'immeubles et les résidents. L'application permet aux gardiens de gérer efficacement leurs bâtiments et leurs tâches, tandis qu'elle offre aux locataires un accès facile aux informations de leur logement, à leur gardien et la possibilité de signaler des incidents.

## Technologies Utilisées (Stack Technique)

Ce projet est développé avec des technologies modernes pour offrir une expérience utilisateur fluide et performante:

*   **React Native:** Framework pour le développement d'applications mobiles multiplateformes (iOS, Android) à partir d'une seule base de code JavaScript/TypeScript.
*   **Expo:** Un ensemble d'outils et de services construits autour de React Native pour simplifier le développement, le déploiement et la gestion d'applications.
*   **TypeScript:** Un sur-ensemble de JavaScript qui ajoute le typage statique, améliorant la robustesse et la maintenabilité du code.
*   **Expo Router:** Pour la gestion de la navigation basée sur les fichiers, simplifiant la création et la gestion des routes de l'application.

## Fonctionnalités

L'application propose des fonctionnalités adaptées à chaque profil :

### Gardiens

- **Gestion des bâtiments** : Vue d'ensemble et gestion des bâtiments, avec détails et maintenance.
- **Suivi des signalements** : Consultation et mise à jour du statut des incidents signalés.
- **Informations sur le bâtiment** : Accès aux informations détaillées sur chaque bâtiment.
- **Coordonnées des locataires** : Visualisation des informations de contact des locataires.
- **Profil** : Gestion des informations personnelles du gardien.
- **Paramètres** : Configuration des préférences de l'application.

### Locataires

- **Signalement d'incidents** : Formulaire simple pour signaler un problème ou une requête.
- **Suivi des signalements** : Suivi de l'avancement des incidents signalés.
- **Informations sur le bâtiment** : Accès aux détails et équipements du bâtiment.
- **Coordonnées du gardien** : Informations de contact et horaires du gardien.
- **Profil** : Gestion des informations personnelles du locataire.
- **Paramètres** : Personnalisation des préférences de l'application.

## Fonctionnalités Transversales (Front-end):

*   **Navigation Cohérente:** Implémentation d'une barre latérale (Sidebar) et d'une barre de navigation (Navbar) pour une navigation intuitive.
*   **En-têtes Uniformisés:** Un composant d'en-tête générique utilisé sur toutes les pages pour une cohérence visuelle et une gestion correcte de la "safe area" (zones de sécurité des appareils).
*   **Design Adaptatif:** Styles conçus pour s'adapter à différentes tailles d'écran et orientations.

## Démarrage Rapide

Pour installer et lancer l'application sur votre environnement de développement:

1.  **Cloner le dépôt:**
    ```bash
    git clone [URL_DE_VOTRE_DEPOT]
    cd CoHabitat
    ```
    (Remplacez `[URL_DE_VOTRE_DEPOT]` par l'URL réelle de votre dépôt Git si ce n'est pas déjà fait.)

2.  **Installer les dépendances:**
    ```bash
    npm install
    ```

3.  **Lancer l'application:**
    ```bash
    npx expo start
    ```

Une fois l'application lancée, vous aurez plusieurs options pour l'ouvrir:

*   Sur un [appareil de développement](https://docs.expo.dev/develop/development-builds/introduction/)
*   Sur un [émulateur Android](https://docs.expo.dev/workflow/android-studio-emulator/)
*   Sur un [simulateur iOS](https://docs.expo.dev/workflow/ios-simulator/)
*   Via [Expo Go](https://expo.dev/go) (une sandbox limitée pour le développement)

Vous pouvez commencer à développer en éditant les fichiers dans le répertoire **app**. Ce projet utilise le [routage basé sur les fichiers](https://docs.expo.dev/router/introduction).

## En savoir plus

Pour approfondir vos connaissances sur le développement avec Expo, consultez ces ressources:

*   [Documentation Expo](https://docs.expo.dev/): Apprenez les bases ou explorez des sujets avancés avec les [guides](https://docs.expo.dev/guides).
*   [Tutoriel Learn Expo](https://docs.expo.dev/tutorial/introduction/): Suivez un tutoriel étape par étape pour créer une application qui fonctionne sur Android, iOS et le web.

## Rejoindre la Communauté

Rejoignez notre communauté de développeurs créant des applications universelles:

*   [Expo sur GitHub](https://github.com/expo/expo): Consultez notre plateforme open source et contribuez.
*   [Communauté Discord](https://chat.expo.dev): Discutez avec les utilisateurs d'Expo et posez vos questions.
