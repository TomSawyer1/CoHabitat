const db = require('../db/database');
const { z } = require('zod');

// Schéma de validation Zod
const incidentSchema = z.object({
    type: z.string().min(1),
    description: z.string().min(1),
    date: z.string().min(1),
    image: z.string().optional().nullable(),
    idUtilisateur: z.number().int(),
    idBatiment: z.number().int()
});

const createIncident = (req, res) => {
    const parseResult = incidentSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Données invalides', errors: parseResult.error.errors });
    }
    const { type, description, date, image, idUtilisateur, idBatiment } = parseResult.data;

    // Vérifier l'existence de l'utilisateur (locataire ou gardien)
    db.get('SELECT id FROM locataire WHERE id = ? UNION SELECT id FROM guardians WHERE id = ?', [idUtilisateur, idUtilisateur], (err, user) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur:', err.message);
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'utilisateur.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        // Vérifier l'existence du bâtiment
        db.get('SELECT id FROM batiments WHERE id = ?', [idBatiment], (err, batiment) => {
            if (err) {
                console.error('Erreur lors de la vérification du bâtiment:', err.message);
                return res.status(500).json({ message: 'Erreur serveur lors de la vérification du bâtiment.' });
            }
            if (!batiment) {
                return res.status(404).json({ message: 'Bâtiment non trouvé.' });
            }
            // Insertion de l'incident
            const query = `INSERT INTO incidents (type, description, date, image, idUtilisateur, idBatiment) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [type, description, date, image || null, idUtilisateur, idBatiment];
            db.run(query, params, function(err) {
                if (err) {
                    console.error('Erreur lors de l\'insertion de l\'incident:', err.message);
                    return res.status(500).json({ message: 'Erreur serveur lors de la création de l\'incident.' });
                }
                res.status(201).json({ message: 'Incident signalé avec succès', incidentId: this.lastID });
            });
        });
    });
};

const getAllIncidents = (req, res) => {
    db.all('SELECT * FROM incidents', [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des incidents:', err.message);
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des incidents.' });
        }
        res.status(200).json(rows);
    });
};

const getIncidentsByUserId = (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Paramètre userId invalide.' });
    }
    db.all('SELECT * FROM incidents WHERE idUtilisateur = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des incidents:', err.message);
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des incidents.' });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Aucun incident trouvé pour cet utilisateur.' });
        }
        res.status(200).json(rows);
    });
};

module.exports = { createIncident, getAllIncidents, getIncidentsByUserId }; 