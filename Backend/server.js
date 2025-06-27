const app = require('./src/app');
require('dotenv').config();
const db = require('./src/db/database'); // S'assurer que la base de données est initialisée

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n🚀 ================================');
    console.log(`🌐 Serveur GuardConnect démarré !`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🤖 Android: http://10.0.2.2:${PORT}`);
    console.log(`🍎 iOS: http://localhost:${PORT}`);
    console.log('🔧 ================================\n');
});

// Fermer la base de données lorsque l'application se termine
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err.message);
        }
        console.log('Déconnecté de la base de données SQLite.');
        process.exit(0);
    });
}); 