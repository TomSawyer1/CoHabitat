# 🔐 CoHabitat — Actions de sécurité (à faire avec l'équipe)

> Ce fichier liste ce que **l'agent ne peut pas terminer seul** (actions destructives sur Git, rotation de secrets en production).
> Les correctifs code sont sur la branche `test` ; ces étapes complètent la mise en sécurité.

---

## ✅ Déjà corrigé dans le code (branche `test`)

- Validation stricte de `JWT_SECRET` au démarrage (plus de fallback en clair)
- Routes profil protégées + contrôle `req.user.id`
- Logs sans mots de passe / sans affichage du secret JWT
- `helmet` + `express-rate-limit` sur `/auth`
- CORS configurable via `CORS_ORIGINS` dans `Backend/.env`
- `.env` et `cohabitat.db` retirés du **suivi Git** (voir ci-dessous)

---

## 🔴 Étape 1 — Retirer les secrets de l'historique Git (OBLIGATOIRE)

Les fichiers `Backend/.env` et `Backend/cohabitat.db` ont été **commités par le passé**.
Les retirer du suivi (`git rm --cached`) ne suffit pas : ils restent dans l'historique.

### 1.1 Installer git-filter-repo (recommandé)

```bash
pip install git-filter-repo
# ou : brew install git-filter-repo
```

### 1.2 Purger les fichiers sensibles de tout l'historique

```bash
cd CoHabitat

git filter-repo --path Backend/.env --invert-paths
git filter-repo --path Backend/cohabitat.db --invert-paths
```

### 1.3 Force push (coordination équipe)

```bash
git push origin --force --all
git push origin --force --tags
```

⚠️ Tous les collaborateurs devront **re-cloner** le dépôt ou `git fetch --all` + reset hard.

---

## 🔴 Étape 2 — Rotation du JWT_SECRET (OBLIGATOIRE)

L'ancien secret a été exposé dans Git (`Backend/.env`). Il faut le considérer **compromis**.

### 2.1 Générer un nouveau secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.2 Mettre à jour les environnements

| Environnement | Action |
|---|---|
| **Local** | Coller dans `Backend/.env` (fichier local, jamais commité) |
| **Railway / prod** | Variables d'environnement du service → `JWT_SECRET` |
| **Expo** | Pas de changement (le secret reste côté serveur uniquement) |

### 2.3 Conséquence

Tous les utilisateurs connectés devront **se reconnecter** (tokens signés avec l'ancien secret invalides).

---

## 🟠 Étape 3 — Base de données locale

`Backend/cohabitat.db` ne doit plus être versionnée.

- Chaque développeur recrée sa DB au premier `npm run dev` (tables + seed auto)
- En prod : prévoir PostgreSQL / autre SGBD (SQLite n'est pas idéal multi-instances)

---

## 🟠 Étape 4 — CORS en production

Dans `Backend/.env` (Railway, etc.) :

```env
CORS_ORIGINS=https://votre-front.expo.dev,https://backend-cohabitat-production.up.railway.app
```

Séparer les origines par des **virgules**, sans espaces superflus.

---

## 🟡 Étape 5 — Vérifications post-déploiement

- [ ] `GET /health` répond `200`
- [ ] Login locataire + gardien OK
- [ ] Création d'incident avec photo OK
- [ ] Aucun `JWT_SECRET` dans les logs Railway
- [ ] `.env` absent de `git ls-files`

---

## Contact / questions

Si une étape bloque (filter-repo, Railway), reprenez ce fichier avec l'équipe et l'agent Cursor pour avancer pas à pas.
