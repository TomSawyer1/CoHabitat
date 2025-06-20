const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../cohabitat.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite cohabitat.db');
        // Création des tables si elles n'existent pas
        db.run(`CREATE TABLE IF NOT EXISTS guardians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            telephone TEXT,
            building_id INTEGER,
            guardian_number TEXT UNIQUE,
            password TEXT NOT NULL,
            FOREIGN KEY (building_id) REFERENCES batiments(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table guardians:', err.message);
            } else {
                console.log('Table guardians créée ou déjà existante.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS locataire (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            telephone TEXT,
            building_id INTEGER,
            password TEXT NOT NULL,
            FOREIGN KEY (building_id) REFERENCES batiments(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table locataire:', err.message);
            } else {
                console.log('Table locataire créée ou déjà existante.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS batiments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            rue TEXT NOT NULL,
            nombre_etage INTEGER,
            nombre_appartement INTEGER,
            annee_construction INTEGER,
            derniere_renovation INTEGER,
            equipements TEXT, -- Stocké en JSON
            id_guardians INTEGER,
            FOREIGN KEY (id_guardians) REFERENCES guardians(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table batiments:', err.message);
            } else {
                console.log('Table batiments créée ou déjà existante.');
                
                // Ajout de données de test pour les bâtiments si la table est vide
                db.get("SELECT COUNT(*) as count FROM batiments", (err, row) => {
                    if (err) {
                        console.error("Erreur lors de la vérification du nombre de bâtiments:", err.message);
                        return;
                    }
                    if (row.count === 0) {
                        const stmt = db.prepare(`INSERT INTO batiments (nom, rue, nombre_etage, nombre_appartement, annee_construction, derniere_renovation, equipements) VALUES (?, ?, ?, ?, ?, ?, ?)`);
                        stmt.run('Résidence Les Alpes', '123 Rue de la Montagne', 5, 20, 2000, 2020, JSON.stringify(['Piscine', 'Salle de sport']));
                        stmt.run('Résidence Le Parc', '456 Avenue du Lac', 3, 15, 1995, 2018, JSON.stringify(['Jardin', 'Parking']));
                        stmt.run('Résidence Les Tilleuls', '789 Boulevard de la Forêt', 8, 30, 2010, 2022, JSON.stringify(['Ascenseur', 'Interphone']));
                        stmt.finalize(() => {
                            console.log('Données de test pour les bâtiments insérées.');
                        });
                    }
                });
            }
        });
    }
});

module.exports = db; 