# Audit CoHabitat — 16 juin 2026

**Scope :** `app/`, `Backend/`, `components/`, `hooks/`, `config/`
**Résumé :** 4 critiques · 19 medium · 23 mineurs — **46 problèmes au total**
**Corrigés :** AS-01, AIS-01 (×5), AIS-02, SEC-01 (×2) — **8 corrigés le 16/06/2026**

---

## Critiques

### ~~AS-01 — Clé `"token"` au lieu de `"userToken"` dans `incidents.tsx`~~ ✅ CORRIGÉ
**Fichier :** `app/signalements/incidents.tsx:66`
Suppression de `imageToken` et `loadToken`. Image servie directement via `/uploads/` public.
**Fix appliqué le 16/06/2026**

---

### ~~AIS-02 — `new Date()` sans normalisation SQLite dans `incidents.tsx`~~ ✅ CORRIGÉ
**Fichier :** `app/signalements/incidents.tsx:152`
`.replace(' ', 'T')` ajouté dans `formatDate` + guard `isNaN`.
**Fix appliqué le 16/06/2026**

---

### ~~SEC-01 — Logs utilisateur sans garde `__DEV__` dans les pages de connexion~~ ✅ CORRIGÉ
**Fichiers :** `app/auth/login.tsx:78`, `app/auth/gardian-login.tsx:78`
`if (__DEV__)` ajouté devant les deux `console.log`.
**Fix appliqué le 16/06/2026**

---

### SEC-08 — Risque de commit accidentel du secret JWT backend
**Fichier :** `Backend/.env`
Un commit accidentel du `.env` nécessiterait une régénération immédiate du JWT secret et l'invalidation de toutes les sessions actives.
**Fix :** Ajouter un hook pre-commit (`git-secrets` ou `.githooks/pre-commit`) pour bloquer les fichiers `.env`.

---

## Medium

### N-01 — `accueil/home` considéré comme route publique
**Fichier :** `app/_layout.tsx:31`
```ts
const isPublic = !root || root === "auth" || root === "accueil";
```
Le tableau de bord (`/accueil/home`) est dans le segment `accueil` → la garde le laisse passer. Un utilisateur non authentifié peut y accéder brièvement avant que les appels API ne retournent 401.
**Fix :** Vérifier le sous-segment ou séparer `accueil/index` (public) de `accueil/home` (privé).

---

### N-02 — Aucun guard de rôle côté frontend sur `gerer-incidents`
**Fichiers :** `app/signalements/gerer-incidents.tsx`, `app/signalements/signalement.tsx`
Un locataire peut naviguer vers `/signalements/gerer-incidents` et voir l'interface de gestion. Le backend refuse les mutations (403) mais l'écran et les données de l'incident sont affichés.

---

### NET-01 — Aucun timeout sur les requêtes fetch
**Fichier :** `config/api.ts`
Pas d'`AbortController`. Si le serveur ne répond pas, l'utilisateur reste bloqué sur un loader indéfiniment.
**Fix :** Ajouter un `AbortController` avec `setTimeout` de 15s.

---

### NET-02 — IP locale hardcodée dans `.env`
**Fichier :** `.env:4`
`EXPO_PUBLIC_API_BASE_URL=http://192.168.1.246:3000` — expose l'adresse IP du développeur si le fichier est commité par erreur.

---

### NET-04 — Images d'incidents sans authentification
**Fichiers :** `gerer-incidents.tsx:389`, `suivresignal.tsx:344`, `profil.tsx:426`
Les photos sont chargées directement via `/uploads/...` sans token. Le dossier est en static public.

---

### ~~AIS-01 — `KeyboardAvoidingView` avec `behavior="height"` sur Android~~ ✅ CORRIGÉ
**Fichiers :** `app/auth/login.tsx`, `register.tsx`, `gardian-login.tsx`, `gardian-register.tsx`, `forgot-password.tsx`
`behavior={Platform.OS === 'ios' ? 'padding' : undefined}` appliqué sur les 5 fichiers. `keyboardVerticalOffset` Android supprimé également.
**Fix appliqué le 16/06/2026**

---

### AS-02 — Brouillon de signalement non effacé lors d'une expiration 401
**Fichiers :** `config/api.ts:104`, `components/sidebar.tsx:49`
La purge 401 dans `api.ts` n'inclut pas `"signalement_draft"`. Le brouillon persiste pour un autre utilisateur sur le même appareil.
**Fix :** Ajouter `"signalement_draft"` dans le `multiRemove` de `api.ts`.

---

### BACK-02 — `building_id` gardien lu depuis le JWT sans vérification BDD
**Fichier :** `Backend/src/controllers/incidentController.js:274`
`guardianBuildingId` vient du JWT uniquement. Un token mal généré ou compromis permettrait des mutations cross-bâtiment.
**Fix :** `SELECT batiments_id FROM guardians WHERE id = req.user.id` et comparer.

---

### BACK-05 — Suppression de compte sans cascade des incidents
**Fichier :** `Backend/src/controllers/authController.js:587`
Les incidents d'un locataire supprimé restent en BDD avec `idUtilisateur` orphelin. Les gardiens continuent de les voir.
**Fix :** `DELETE FROM incidents WHERE idUtilisateur = ?` avant de supprimer l'utilisateur.

---

### BACK-06 — `PRAGMA foreign_keys` jamais activé
**Fichier :** `Backend/src/db/database.js`
SQLite n'enforce les foreign keys que si `PRAGMA foreign_keys = ON` est exécuté à chaque connexion. Absent ici : toutes les contraintes référentielles déclarées dans le schéma sont silencieusement ignorées.
**Fix :** Ajouter `db.run('PRAGMA foreign_keys = ON')` juste après l'ouverture de la connexion.

---

### BACK-08 — Extension de fichier extraite du nom client, non du MIME réel
**Fichier :** `Backend/src/middleware/upload.js:20`
```js
const ext = path.extname(file.originalname); // fourni par le client
```
Le client peut falsifier le MIME type.
**Fix :** Utiliser `file-type` pour déduire l'extension depuis les magic bytes.

---

### SEC-02 — Emails utilisateur loggés en production côté backend
**Fichier :** `Backend/src/controllers/authController.js:466`
```js
console.log('✅ [PROFILE] Profil trouvé:', { id: user.id, email: user.email });
```
Sans condition `NODE_ENV !== 'production'` → email dans les logs à chaque consultation de profil.

---

### SEC-03 — JWT stocké en clair dans AsyncStorage non chiffré
**Fichiers :** `app/auth/login.tsx:65`, `app/auth/gardian-login.tsx:65`
Sur Android rooté ou émulateur, le JWT et les données de profil sont lisibles. Mitigation partielle : expiration JWT à 24h.

---

### SEC-04 — Pas de vérification de rôle frontend sur `gerer-incidents`
**Fichier :** `app/signalements/gerer-incidents.tsx`
Un locataire voit l'interface de gestion et les données de l'incident via le GET. Seules les mutations échouent en 403.

---

### SEC-05 — `/uploads` accessible sans authentification
**Fichier :** `Backend/src/app.js:46`
Les photos d'incidents sont servies publiquement via `express.static`. Les noms de fichiers apparaissent dans les réponses API, annulant la protection par obscurité.

---

### SEC-06 — Inscription gardien sans validation du numéro gardien
**Fichier :** `Backend/src/controllers/authController.js`
N'importe qui peut créer un compte gardien avec un `numeroGardien` arbitraire. Pas de liste pré-approuvée ni de code d'invitation.

---

### UX-01 — Sélecteur de bâtiment sans indicateur de chargement
**Fichiers :** `app/auth/register.tsx:35`, `app/auth/gardian-register.tsx:36`
`buildingsLoading` est mis à jour mais jamais rendu. L'utilisateur voit le sélecteur vide.

---

### UX-03 — Chargement de commentaires sur un incident `null`
**Fichier :** `app/signalements/suivresignal.tsx:119`
Si le GET incident échoue, l'écran continue de charger commentaires et historique avant d'afficher "Incident non trouvé" sans contexte.

---

## Mineurs

| ID | Fichier | Description |
|---|---|---|
| N-03 | `app/batiments/batiments.tsx` | Route déclarée dans le Stack mais aucun lien ne pointe vers elle. Code mort. |
| N-04 | `app/signalements/index.tsx` | Retourne `null` pendant la lecture AsyncStorage → écran blanc sans loader. |
| N-05 | `app/+not-found.tsx:13` | Texte anglais dans une app en français. |
| AS-03 | `login.tsx:75` | `userBuildingAddress` stocké à chaque connexion mais jamais lu. |
| AS-04 | `register.tsx:35` | `buildingsLoading` déclaré mais jamais rendu dans l'UI. |
| NET-03 | `register.tsx:17` | `API_BASE_URL` importé mais non utilisé. |
| NET-05 | `config/index.ts:39` | `console.log` URL API sans garde `__DEV__`, s'exécutent en prod. |
| NET-06 | `config/index.ts:42` | `BACKEND_PORT` exporté mais jamais importé. |
| AIS-03 | `Backend/src/app.js:46` | `/uploads` sans header `Cache-Control`. |
| BACK-03 | `incidentController.js:442` | Check `req.incident.id !== incidentId` toujours faux après `ensureIncidentAccess`. Code mort. |
| BACK-04 | `authController.js:88` | Erreurs 409/500 sans `success: false`, incohérent avec le reste de l'API. |
| BACK-07 | `database.js:121` | `db.run('PRAGMA table_info(...)')` retourne toujours `undefined` — il faut `db.all`. |
| UX-02 | `app/accueil/home.tsx:76` | Erreur stats loggée en console uniquement, compteurs à 0 sans feedback. |
| UX-04 | `app/profil/parametres.tsx:25` | Toggle Français/Anglais sans effet. Fonctionnalité factice. |
| UX-05 | `gerer-incidents.tsx:240` | `const phoneNumber = incident.user_email` — variable mal nommée, jamais utilisée. |
| UX-06 | `mon-batiment.tsx`, `mon-gardien.tsx` | Bouton "Réessayer" sans loader pendant le rechargement. |
| DEAD-01 | `register.tsx:17` | `API_BASE_URL` importé mais inutilisé. |
| DEAD-02 | `suivresignal.tsx:84`, `gerer-incidents.tsx:86` | `signalementTypes` déclaré mais non utilisé dans ces composants. |
| DEAD-03 | `config/index.ts:42` | `BACKEND_PORT` exporté mais jamais consommé. |
| DEAD-04 | `package.json` | `"jwt-decode": "^4.0.0"` installé mais non importé nulle part. |
| DEAD-05 | `gerer-incidents.tsx:466`, `suivresignal.tsx:354` | Variable `index` dans `.map((item, index) => ...)` jamais utilisée. |
| SEC-07 | `app/profil/profil.tsx:233` | `AsyncStorage.clear()` efface tout le storage. Préférer `multiRemove` explicite. |

---

## Priorités suggérées

### P1 — À corriger immédiatement
1. ~~**AS-01**~~ ✅ corrigé le 16/06/2026
2. ~~**AIS-02**~~ ✅ corrigé le 16/06/2026
3. ~~**SEC-01**~~ ✅ corrigé le 16/06/2026
4. **BACK-06** `database.js` — `PRAGMA foreign_keys = ON` manquant
5. ~~**AIS-01** (x5 fichiers)~~ ✅ corrigé le 16/06/2026

### P2 — Sprint suivant
6. **AS-02** — Ajouter `"signalement_draft"` dans la purge 401
7. **NET-01** — Timeout sur `apiFetch` avec `AbortController`
8. **BACK-05** — Cascade DELETE sur suppression de compte
9. **UX-01** — Indicateur de chargement pour le sélecteur de bâtiment
10. **SEC-06** — Validation ou code d'invitation pour l'inscription gardien

### P3 — Backlog
- Nettoyage du code mort (DEAD-01 à DEAD-05)
- Suppression des imports inutilisés
- Internationalisation de `+not-found.tsx`
- Page paramètres réelle (UX-04)
