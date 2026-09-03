# Audit CoHabitat — 6 juillet 2026

**Scope :** `app/`, `Backend/`, `components/`, `hooks/`, `config/`, `back-office/`
**Résumé :** 6 critiques · 26 medium · 29 mineurs — **61 problèmes au total**
**Corrigés :** 8 le 16/06/2026 · **53 le 06/07/2026 → 61/61 traités** ✅

> Mise à jour du 06/07/2026 (soir) : l'intégralité des problèmes ouverts a été corrigée.
> Vérifications effectuées : `node --check` sur tous les fichiers Backend modifiés, `tsc --noEmit` propre sur le back-office et sur l'app Expo, `prisma db push` appliqué, smoke-test HTTP (health 200, `/uploads` sans token → 401, login vide → 400).

---

## Critiques — tous corrigés ✅

### ~~AS-01 — Clé `"token"` au lieu de `"userToken"` dans `incidents.tsx`~~ ✅ (16/06)
### ~~AIS-02 — `new Date()` sans normalisation SQLite~~ ✅ (16/06)
### ~~SEC-01 — Logs utilisateur sans garde `__DEV__` (login)~~ ✅ (16/06)

### ~~SEC-08 — Risque de commit accidentel du secret JWT backend~~ ✅ CORRIGÉ 06/07
Hook `.githooks/pre-commit` ajouté : bloque tout commit contenant un fichier `.env` (hors `.example`/`.exemple`). `core.hooksPath` configuré sur ce clone. Couvre `Backend/.env`, `.env` racine et `back-office/.env`.
⚠️ À refaire sur chaque nouveau clone : `git config core.hooksPath .githooks`.

### ~~BO-01 — Reset de mot de passe back-office incompatible avec le login mobile~~ ✅ CORRIGÉ 06/07
`hashAppUserPassword` (`back-office/src/lib/auth/password.ts`) hash désormais en **bcrypt** (10 rounds), le format que le Backend Express sait vérifier. Argon2id reste réservé aux comptes staff. Texte du dialog de reset mis à jour.

### ~~BO-02 — Suspension/bannissement sans effet sur l'app mobile~~ ✅ CORRIGÉ 06/07
- `authController.js` (login) : refus 403 si `status !== 'active'` (vérifié après le mot de passe pour ne pas révéler l'existence du compte).
- `middleware/auth.js` : l'utilisateur est revérifié en BDD à **chaque requête** → les JWT déjà émis sont invalidés dès la suspension.

---

## Medium — tous corrigés ✅

### ~~N-01 — `accueil/home` considéré comme route publique~~ ✅ CORRIGÉ 06/07
`app/_layout.tsx` : la garde vérifie le sous-segment — `accueil/index` reste public, `accueil/home` exige un token.

### ~~N-02 / SEC-04 — Aucun guard de rôle frontend sur `gerer-incidents`~~ ✅ CORRIGÉ 06/07
`gerer-incidents.tsx` : un non-gardien est redirigé vers `suivresignal` (ou l'accueil) avant affichage de l'interface de gestion.

### ~~NET-01 — Aucun timeout sur les requêtes fetch~~ ✅ CORRIGÉ 06/07
`config/api.ts` : `AbortController` avec timeout de 15 s sur toutes les requêtes (un `signal` fourni par l'appelant reste prioritaire).

### ~~NET-02 — IP locale hardcodée dans `.env`~~ ✅ TRAITÉ 06/07
Le fichier n'est pas suivi par git et le hook pre-commit (SEC-08) bloque désormais tout commit de `.env`.

### ~~NET-04 / SEC-05 — Images d'incidents / `/uploads` sans authentification~~ ✅ CORRIGÉ 06/07
- Backend : `app.use('/uploads', auth, express.static(...))` — vérifié par smoke-test (401 sans token).
- App : nouveau composant `components/AuthImage.tsx` qui charge les images avec le header `Authorization` (utilisé dans `incidents.tsx`, `gerer-incidents.tsx`, `suivresignal.tsx`, `profil.tsx`).

### ~~AIS-01 — `KeyboardAvoidingView` `behavior="height"` sur Android~~ ✅ (16/06)

### ~~AS-02 — Brouillon non effacé lors d'une expiration 401~~ ✅ CORRIGÉ 06/07
`"signalement_draft"` ajouté à la purge 401 de `config/api.ts` (et à la purge de suppression de compte).

### ~~BACK-02 — `building_id` gardien lu depuis le JWT sans vérification BDD~~ ✅ CORRIGÉ 06/07
Le middleware `auth.js` charge désormais `batiments_id` depuis la BDD et écrase la valeur du token. `incidentController` en hérite automatiquement.

### ~~BACK-05 — Suppression de compte sans cascade~~ ✅ CORRIGÉ 06/07
`deleteMyAccount` : transaction SQLite — locataire : commentaires + historique + incidents supprimés ; gardien : incidents désassignés, bâtiments détachés, commentaires purgés.

### ~~BACK-06 — `PRAGMA foreign_keys` jamais activé~~ ✅ CORRIGÉ 06/07
`database.js` : `PRAGMA foreign_keys = ON` à l'ouverture de la connexion.

### ~~BACK-08 — Extension extraite du nom client, non du contenu~~ ✅ CORRIGÉ 06/07
`middleware/upload.js` : validation des **magic bytes** (JPEG/PNG/GIF/WebP) du fichier écrit sur disque ; suppression immédiate + 400 si le contenu n'est pas une image.

### ~~SEC-02 — Emails loggés en production côté backend~~ ✅ CORRIGÉ 06/07
Logs profil gardés derrière `NODE_ENV !== 'production'` et expurgés de l'email.

### ~~SEC-03 — JWT stocké en clair dans AsyncStorage~~ ✅ CORRIGÉ 06/07
Nouveau module `config/tokenStorage.ts` basé sur **expo-secure-store** (Keychain/Keystore), fallback AsyncStorage sur web, migration automatique des anciens tokens. Tous les points de lecture/écriture du token migrés (login ×2, layout, api, profil, signalement, mon-batiment, mon-gardien, sidebar).

### ~~SEC-06 — Inscription gardien sans validation du numéro~~ ✅ CORRIGÉ 06/07
Liste blanche `GUARDIAN_ALLOWED_NUMBERS` (env, documentée dans `.env-exemple`). Si définie, seuls ces numéros peuvent s'inscrire (403 sinon). Sans la variable, comportement démo inchangé.

### ~~UX-01 / AS-04 — Sélecteur de bâtiment sans indicateur de chargement~~ ✅ CORRIGÉ 06/07
`register.tsx` + `gardian-register.tsx` : `ActivityIndicator` + texte « Chargement des bâtiments… », sélecteur désactivé pendant le chargement.

### ~~UX-03 — Chargement de commentaires sur un incident `null`~~ ✅ CORRIGÉ 06/07
`suivresignal.tsx` : si le GET incident échoue, on court-circuite le chargement des commentaires/historique.

### ~~BO-03 — Aucune protection brute-force sur le login staff~~ ✅ CORRIGÉ 06/07
`loginAction` : compteur `failed_login_count`, verrouillage `locked_until` 15 min après 5 échecs, journalisation de chaque tentative dans `login_attempts`.

### ~~BO-04 — Aucun contrôle de rôle (RBAC)~~ ✅ CORRIGÉ 06/07
Helper `requireRole` (hiérarchie operator < admin < super_admin). Mutations utilisateurs/bâtiments + export CSV réservés aux **admins** (retour `{ error }` propre, toasts côté UI). Les opérateurs conservent la lecture et la gestion des incidents.

### ~~BO-05 — Table `AuditLog` jamais alimentée~~ ✅ CORRIGÉ 06/07
Nouveau `src/lib/audit.ts` (`logAudit`) : toutes les mutations (users, bâtiments, incidents, login, changement de mot de passe) écrivent acteur, action, cible, métadonnées et IP.

### ~~BO-06 — SQLite partagé sans configuration de concurrence~~ ✅ CORRIGÉ 06/07
- Express : `PRAGMA journal_mode = WAL` + `busy_timeout = 5000`.
- Prisma : `?connection_limit=1&socket_timeout=5` sur `DATABASE_URL` (`.env` + `.env.example`).

### ~~BO-07 — Statut d'incident non validé et historique contourné~~ ✅ CORRIGÉ 06/07
`z.enum(["nouveau","en_cours","resolu","ferme"])` + écriture `incident_history` (transaction) sur chaque changement de statut / assignation depuis le back-office.

### ~~BO-08 — Suppressions sans gestion des FK~~ ✅ CORRIGÉ 06/07
`deleteAppUser` : cascade explicite en `$transaction`. `deleteBatiment` : refus propre avec décompte des locataires/gardiens/incidents rattachés.

### ~~BO-09 — Token CSRF généré mais jamais vérifié~~ ✅ CORRIGÉ 06/07
Code et colonne `csrf_token` supprimés (les Server Actions Next.js vérifient l'`Origin` nativement ; le cookie est `SameSite=strict`). Schéma synchronisé via `prisma db push`.

---

## Mineurs — tous corrigés ✅ (06/07/2026)

| ID | Fix appliqué |
|---|---|
| N-03 | Route morte supprimée : `app/batiments/batiments.tsx` + `hooks/useBatimentsStyle.ts` + entrée Stack. |
| N-04 | `signalements/index.tsx` : `ActivityIndicator` pendant la redirection. |
| N-05 | `+not-found.tsx` traduit en français. |
| AS-03 | `userBuildingAddress` n'est plus écrit au login (reste dans les purges pour nettoyer les anciennes installations). |
| NET-03 / DEAD-01 | Import `API_BASE_URL` inutilisé supprimé de `register.tsx` (+ import `AsyncStorage` mort). |
| NET-05 | `config/index.ts` : tous les logs derrière `__DEV__`. |
| NET-06 / DEAD-03 | `BACKEND_PORT` supprimé. |
| AIS-03 | `/uploads` servi avec `Cache-Control: private, max-age=604800`. |
| BACK-03 | Check mort supprimé dans `addIncidentComment`. |
| BACK-04 | `success: false` ajouté aux 409/500 des inscriptions (+ `success: true` sur les 201). |
| BACK-07 | `db.run('PRAGMA table_info')` mort supprimé — seul le `db.all` correct subsiste. |
| UX-02 | `home.tsx` : état `statsError` + message « Appuyez pour réessayer ». |
| UX-04 | Toggle de langue factice remplacé par une ligne désactivée « Français (bientôt disponible) ». |
| UX-05 | Variable `phoneNumber` mal nommée supprimée. |
| UX-06 | `mon-batiment` / `mon-gardien` : `ActivityIndicator` pendant le rechargement. |
| DEAD-02 | `signalementTypes` supprimé de `suivresignal.tsx` et `gerer-incidents.tsx`. |
| DEAD-04 | `jwt-decode` désinstallé. |
| DEAD-05 | Paramètres `index` inutilisés supprimés des `.map()`. |
| SEC-07 | `AsyncStorage.clear()` remplacé par `removeToken()` + `multiRemove` ciblé. |
| BO-10 | Export CSV : cellules commençant par `= + - @` préfixées d'un `'` (anti-injection Excel). |
| BO-11 | Pagination poussée en SQL pour les filtres mono-type ; le cas « tous types » (fusion 2 tables) reste trié en mémoire mais avec un `select` minimal — limitation documentée dans le code. |
| BO-12 | Collision email (`P2002`) → « Cet email est déjà utilisé » au lieu d'une 500. |
| BO-13 | `bulkSetAppUserStatus` : `updateMany` par type dans une `$transaction`. |
| BO-14 | Dossier vide `back-office/Backend/` supprimé. |
| BO-15 | Schéma mort supprimé (`totp_secret`, `totp_enabled`, modèle `PasswordResetToken`) ; `LoginAttempt`, `failed_login_count` et `locked_until` sont désormais réellement utilisés (BO-03). |

---

## Limitations / points d'attention restants

1. **SEC-06** : la liste blanche gardien n'est active que si `GUARDIAN_ALLOWED_NUMBERS` est défini — à configurer avant toute mise en production.
2. **SEC-08** : `git config core.hooksPath .githooks` doit être exécuté sur chaque nouveau clone.
3. **BO-11** : le tri fusionné « tous types » reste en mémoire (acceptable au volume actuel ; passer à une vue SQL `UNION` si la base grossit).
4. **Sessions back-office** : la suppression de la colonne `csrf_token` a invalidé les sessions staff existantes — reconnexion nécessaire (une fois).
5. Les mots de passe app-mobile déjà réinitialisés en argon2 **avant** ce correctif (s'il y en a) doivent être re-réinitialisés depuis le back-office pour redevenir utilisables sur mobile.
