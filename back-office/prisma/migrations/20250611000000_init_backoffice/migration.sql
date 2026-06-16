# Migration initiale — back-office CoHabitat
# Appliquée via: npx prisma db push (ou prisma migrate deploy)

-- Colonnes status sur utilisateurs app (locataire + gardiens)
-- ALTER TABLE locataire ADD COLUMN status TEXT DEFAULT 'active';
-- ALTER TABLE guardians ADD COLUMN status TEXT DEFAULT 'active';

-- Tables back-office créées par Prisma:
-- staff_accounts, staff_sessions, audit_logs, password_reset_tokens, login_attempts
