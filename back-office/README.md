# CoHabitat — Back-office (ERP / Admin)

Panneau d'administration web pour les opérateurs CoHabitat. Gère les utilisateurs de l'app mobile (locataires + gardiens), les comptes staff, et fournit un journal d'audit complet.

## Architecture

```
CoHabitat/
├── app/                    # App mobile Expo (inchangée)
├── Backend/                # API REST Express + cohabitat.db
└── back-office/            # Ce projet — Next.js 16 + Prisma
```

Le back-office **partage la même base SQLite** (`Backend/cohabitat.db`) que l'API mobile. Les comptes staff (`staff_accounts`) sont séparés des utilisateurs app (`locataire` / `guardians`).

## Prérequis

- Node.js 18+
- npm
- Backend mobile démarré (optionnel pour la gestion utilisateurs — accès direct DB)

## Installation

```bash
cd back-office
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
```

## Configuration (.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chemin SQLite — `file:../Backend/cohabitat.db` |
| `SESSION_SECRET` | Secret sessions (min. 32 caractères) |
| `APP_URL` | URL publique du back-office |
| `SESSION_MAX_AGE` | Durée session (secondes, défaut 28800) |
| `SESSION_INACTIVITY_TIMEOUT` | Déconnexion inactivité (défaut 1800) |
| `LOGIN_MAX_ATTEMPTS` | Tentatives login max (défaut 5) |
| `LOGIN_WINDOW_MINUTES` | Fenêtre rate limit (défaut 15) |

## Lancement

```bash
# Terminal 1 — API mobile (port 3000)
cd Backend && npm run dev

# Terminal 2 — Back-office (port 3001)
cd back-office && npm run dev
```

Ouvrir [http://localhost:3001/login](http://localhost:3001/login)

### Compte démo (seed)

| Champ | Valeur |
|-------|--------|
| Email | `admin@cohabitat.app` |
| Mot de passe | `SuperAdmin123!@#` |

## Sécurité

- **Auth staff** : sessions cookies httpOnly + Secure + SameSite=Strict (séparées du JWT mobile)
- **Mots de passe staff** : argon2id
- **Mots de passe app** : argon2id lors des resets admin (bcrypt accepté à la vérification pour l'existant)
- **CSRF** : token par session sur toutes les mutations
- **Rate limiting** : 5 échecs / 15 min par IP + email
- **2FA TOTP** : architecture prête (activation dans Paramètres)
- **Audit log** : toutes actions sensibles tracées
- **En-têtes** : CSP, HSTS (prod), X-Frame-Options, etc.

## Rôles (RBAC)

| Rôle | Permissions |
|------|-------------|
| `super_admin` | Accès total + gestion opérateurs |
| `admin` | Utilisateurs + audit + paramètres |
| `operator` | Lecture/écriture utilisateurs, pas de suppression ni staff |

## Modules

1. **Dashboard** — KPIs, graphiques inscriptions et incidents
2. **Utilisateurs** — Locataires + gardiens unifiés, filtres, export CSV, actions groupées
3. **Opérateurs** — CRUD comptes staff (super_admin)
4. **Audit** — Journal filtrable
5. **Paramètres** — Profil, mot de passe, 2FA

## Connexion à l'app Expo existante

Aucune modification requise côté mobile. Le back-office lit/écrit directement dans `cohabitat.db`.

Pour ajouter le statut `suspended`/`banned` côté API mobile, filtrer au login :

```javascript
// Backend/src/controllers/authController.js — suggestion
if (user.status && user.status !== 'active') {
  return res.status(403).json({ success: false, message: 'Compte désactivé.' });
}
```

## Migrations

```bash
npx prisma db push          # synchroniser le schéma
npx prisma migrate dev        # créer une migration versionnée
npm run db:seed               # compte super_admin
```

## Production

1. Générer un `SESSION_SECRET` fort (32+ caractères aléatoires)
2. Configurer `APP_URL` avec HTTPS
3. Configurer SMTP pour reset mot de passe
4. `npm run build && npm start`
5. Placer un reverse proxy (nginx) avec TLS
