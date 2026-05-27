# 🔐 CoHabitat — Actions de sécurité

> Guide pour compléter la mise en sécurité après les correctifs code (branche `test`).

---

## ✅ Déjà fait (2026-05-27)

### Code (branche `test`)

- Validation stricte de `JWT_SECRET` au démarrage
- Routes profil protégées + contrôle `req.user.id`
- `helmet` + `express-rate-limit` sur `/auth`
- CORS configurable via `CORS_ORIGINS` dans `Backend/.env`
- Migration frontend vers `apiFetch` (401 global)

### Git

- `git filter-repo` : `Backend/.env`, `Backend/cohabitat.db`, `.env` (racine Expo) purgés de **tout l'historique**
- Force push sur `main` et `test`
- Fichiers sensibles absents de `git ls-files`

⚠️ **Re-clonez** le dépôt si vous aviez un clone avant cette date :
`git fetch origin && git reset --hard origin/test`

### JWT local

- Nouvelle clé 64 bytes dans `Backend/.env` (machine locale uniquement — ne jamais commiter)

---

## 🔴 À faire manuellement — Railway (5 min)

1. [railway.app](https://railway.app) → projet CoHabitat → service backend → **Variables**
2. Mettre à jour `JWT_SECRET` avec la valeur de votre `Backend/.env` local (ou une clé prod dédiée)
3. Optionnel : `CORS_ORIGINS` (virgules, sans espaces superflus) :
   ```env
   CORS_ORIGINS=https://backend-cohabitat-production.up.railway.app,exp://192.168.x.x:8081
   ```
4. Redéployer → tous les utilisateurs devront **se reconnecter**

---

## 🟠 Base de données

- `Backend/cohabitat.db` : local uniquement, recréée au `npm run dev`
- Prod : prévoir PostgreSQL (SQLite non adapté multi-instances)

---

## 🟡 Vérifications post-déploiement

- [ ] `GET /health` → `200` (test local OK le 2026-05-27)
- [ ] Login locataire + gardien OK
- [ ] Création d'incident avec photo OK
- [ ] Aucun `JWT_SECRET` dans les logs Railway
- [ ] `git ls-files` ne liste pas `Backend/.env` ni `Backend/cohabitat.db`

---

## Référence — regénérer un JWT

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
