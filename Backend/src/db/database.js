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
            batiments_id INTEGER,
            guardian_number TEXT UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (batiments_id) REFERENCES batiments(id)
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
            batiments_id INTEGER,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (batiments_id) REFERENCES batiments(id)
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
            reglement TEXT,
            id_guardians INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_guardians) REFERENCES guardians(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table batiments:', err.message);
            } else {
                console.log('Table batiments créée ou déjà existante.');
                
                // Ajout de données de test pour les bâtiments si la table est vide
                // Forcer la création des bâtiments de test
                db.get("SELECT COUNT(*) as count FROM batiments", (err, row) => {
                    if (err) {
                        console.error("Erreur lors de la vérification du nombre de bâtiments:", err.message);
                        return;
                    }
                    if (row.count === 0) {
                        const stmt = db.prepare(`INSERT INTO batiments (nom, rue, nombre_etage, nombre_appartement, annee_construction, derniere_renovation, equipements, reglement) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                        stmt.run('Résidence Les Alpes', '123 Rue de la Montagne', 5, 20, 2000, 2020, JSON.stringify(['Piscine', 'Salle de sport', 'Ascenseur']), 'Règlement de copropriété des Alpes');
                        stmt.run('Résidence Le Parc', '456 Avenue du Lac', 3, 15, 1995, 2018, JSON.stringify(['Jardin', 'Parking', 'Interphone']), 'Règlement de copropriété du Parc');
                        stmt.run('Résidence Les Tilleuls', '789 Boulevard de la Forêt', 8, 30, 2010, 2022, JSON.stringify(['Ascenseur', 'Interphone', 'Garage']), 'Règlement de copropriété des Tilleuls');
                        stmt.finalize(() => {
                            console.log('Données de test pour les bâtiments insérées.');
                        });
                    }
                });
            }
        });

        // Table incidents améliorée avec statuts et suivi
        db.run(`CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            title TEXT,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            image TEXT,
            status TEXT DEFAULT 'nouveau' CHECK(status IN ('nouveau', 'en_cours', 'resolu', 'ferme')),
            idUtilisateur INTEGER NOT NULL,
            idBatiment INTEGER NOT NULL,
            etage TEXT,
            numero_porte TEXT,
            assigned_guardian_id INTEGER,
            resolution_comment TEXT,
            resolved_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idUtilisateur) REFERENCES locataire(id),
            FOREIGN KEY (idBatiment) REFERENCES batiments(id),
            FOREIGN KEY (assigned_guardian_id) REFERENCES guardians(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table incidents:', err.message);
            } else {
                console.log('Table incidents créée ou déjà existante.');
                
                // Migration : Ajouter la colonne title si elle n'existe pas
                db.run(`PRAGMA table_info(incidents)`, (err, rows) => {
                    if (err) {
                        console.error('Erreur lors de la vérification de la structure de la table incidents:', err.message);
                        return;
                    }
                    
                    // Vérifier si la colonne title existe déjà
                    db.all(`PRAGMA table_info(incidents)`, (err, columns) => {
                        if (err) {
                            console.error('Erreur lors de la récupération des colonnes:', err.message);
                            return;
                        }
                        
                        const hasTitle = columns.some(col => col.name === 'title');
                        if (!hasTitle) {
                            console.log('🔄 [MIGRATION] Ajout de la colonne title à la table incidents...');
                            db.run(`ALTER TABLE incidents ADD COLUMN title TEXT`, (err) => {
                                if (err) {
                                    console.error('❌ [MIGRATION] Erreur lors de l\'ajout de la colonne title:', err.message);
                                } else {
                                    console.log('✅ [MIGRATION] Colonne title ajoutée avec succès à la table incidents.');
                                }
                            });
                        } else {
                            console.log('✅ [MIGRATION] Colonne title déjà présente dans la table incidents.');
                        }
                    });
                });
            }
        });

        // Table pour l'historique des incidents
        db.run(`CREATE TABLE IF NOT EXISTS incident_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            old_status TEXT,
            new_status TEXT,
            comment TEXT,
            user_id INTEGER NOT NULL,
            user_role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table incident_history:', err.message);
            } else {
                console.log('Table incident_history créée ou déjà existante.');
            }
        });

        // Table pour les commentaires sur les incidents
        db.run(`CREATE TABLE IF NOT EXISTS incident_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_role TEXT NOT NULL CHECK(user_role IN ('locataire', 'guardian')),
            comment TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table incident_comments:', err.message);
            } else {
                console.log('Table incident_comments créée ou déjà existante.');
            }
        });
    }
});

module.exports = db; 