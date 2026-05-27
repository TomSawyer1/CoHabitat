# 🔐 CoHabitat — Sécurité (développement local)

> CoHabitat tourne en **local** (backend Node + SQLite + Expo). Ce fichier résume l’état de sécurité et les vérifications utiles.

---

## ✅ Déjà en place (branche `test`)

- Validation stricte de `JWT_SECRET` au démarrage
- Routes profil protégées + contrôle `req.user.id`
- `helmet` + `express-rate-limit` sur `/auth`
- CORS via `CORS_ORIGINS` dans `Backend/.env` (défaut : localhost / Expo)
- Migration frontend vers `apiFetch` (401 global)
- `Backend/.env`, `Backend/cohabitat.db`, `.env` racine : **hors Git** (historique purgé)

⚠️ Clone ancien ? `git fetch origin && git reset --hard origin/test`

---

## Configuration locale

### Backend (`Backend/.env`)

Copier depuis `Backend/.env-exemple`, puis :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Coller le résultat dans `JWT_SECRET=...`

CORS optionnel (défaut = ports Expo locaux) :

```env
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,exp://localhost:19000
```

### Frontend (`.env` à la racine)

```env
# Appareil physique (Wi‑Fi) — remplacer par votre IP locale
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000

# Émulateur Android
# EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000

# Expo Go / simulateur iOS sur le même PC
# EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Base de données

- `Backend/cohabitat.db` : fichier local uniquement, recréée au `npm run dev`
- Ne jamais la versionner

---

## Vérifications rapides

- [ ] `GET http://localhost:3000/health` → `200`
- [ ] Login locataire + gardien OK
- [ ] Création d’incident avec photo OK
- [ ] `git ls-files` ne liste pas `Backend/.env` ni `Backend/cohabitat.db`

---

## Regénérer un JWT

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Après changement de secret, les utilisateurs doivent **se reconnecter**.
