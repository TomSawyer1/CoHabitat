// Chargement et validation des variables d'environnement.
// Ce module est chargé en premier au boot du serveur : s'il manque une
// variable critique, on fait planter immédiatement plutôt que de tourner
// avec un secret connu.

require('dotenv').config();

const REQUIRED = ['JWT_SECRET'];

const missing = REQUIRED.filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
});

if (missing.length > 0) {
    console.error('\n❌ Variables d\'environnement manquantes :');
    for (const key of missing) {
        console.error(`   - ${key}`);
    }
    console.error('\n💡 Renseignez-les dans Backend/.env (cf. Backend/.env-exemple).');
    console.error('   Pour générer un JWT_SECRET fort :');
    console.error('   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    process.exit(1);
}

// Refus explicite des valeurs par défaut faibles qui auraient pu traîner
// dans un .env hérité.
const WEAK_SECRETS = new Set([
    'cohabitat_secret_key_2024',
    'secret',
    'changeme',
    'jwt_secret',
]);

if (WEAK_SECRETS.has(process.env.JWT_SECRET.trim().toLowerCase())) {
    console.error('\n❌ JWT_SECRET utilise une valeur par défaut connue. Régénérez-en un.');
    console.error('   node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    process.exit(1);
}

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
};
