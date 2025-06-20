const app = require('./src/app');
const db = require('./src/db/database'); // S'assurer que la base de données est initialisée

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serveur en cours d\'exécution sur http://localhost:${PORT}`);
});

// Fermer la base de données lorsque l'application se termine
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err.message);
        }
        console.log('Déconnecté de la base de données SQLite.');
        process.exit(0);
    });
}); 