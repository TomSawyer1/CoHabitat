const db = require('../db/database');
const { z } = require('zod');

// Schémas de validation Zod
const incidentSchema = z.object({
    type: z.string().min(1),
    title: z.string().optional(),
    description: z.string().min(1),
    date: z.string().min(1),
    idUtilisateur: z.number().int(),
    idBatiment: z.number().int(),
    etage: z.string().optional(),
    numero_porte: z.string().optional()
});

const updateIncidentSchema = z.object({
    status: z.enum(['nouveau', 'en_cours', 'resolu', 'ferme']).optional(),
    assigned_guardian_id: z.number().int().optional(),
    resolution_comment: z.string().optional()
});

// Fonction utilitaire pour ajouter à l'historique
const addToHistory = (incidentId, action, oldStatus, newStatus, comment, userId, userRole) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO incident_history (incident_id, action, old_status, new_status, comment, user_id, user_role) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [incidentId, action, oldStatus, newStatus, comment, userId, userRole], function(err) {
            if (err) {
                console.error('Erreur lors de l\'ajout à l\'historique:', err);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// Créer un incident (modifié pour supporter les images)
const createIncident = async (req, res) => {
    try {
        console.log('🔍 [INCIDENT] Body reçu:', req.body);
        console.log('🔍 [INCIDENT] Fichier reçu:', req.file);

        // Convertir les strings en nombres pour la validation Zod
        const bodyData = {
            ...req.body,
            idUtilisateur: parseInt(req.body.idUtilisateur),
            idBatiment: parseInt(req.body.idBatiment)
        };

        const parseResult = incidentSchema.safeParse(bodyData);
        if (!parseResult.success) {
            console.error('❌ [INCIDENT] Validation échouée:', parseResult.error.errors);
            return res.status(400).json({ 
                success: false,
                message: 'Données invalides', 
                errors: parseResult.error.errors 
            });
        }

        const { type, title, description, date, idUtilisateur, idBatiment, etage, numero_porte } = parseResult.data;
        
        // Récupérer le nom du fichier si une image a été uploadée
        const imagePath = req.file ? req.file.filename : null;
        
        console.log('✅ [INCIDENT] Données validées:', { type, title, description, date, idUtilisateur, idBatiment, etage, numero_porte, imagePath });

        // Vérifier l'existence de l'utilisateur
        const userQuery = req.user.role === 'locataire' ? 
            'SELECT id FROM locataire WHERE id = ?' : 
            'SELECT id FROM guardians WHERE id = ?';

        db.get(userQuery, [idUtilisateur], (err, user) => {
            if (err) {
                console.error('❌ [INCIDENT] Erreur vérification utilisateur:', err.message);
                return res.status(500).json({ success: false, message: 'Erreur serveur.' });
            }
            if (!user) {
                console.error('❌ [INCIDENT] Utilisateur non trouvé:', idUtilisateur);
                return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
            }

            console.log('✅ [INCIDENT] Utilisateur trouvé:', user);

            // Vérifier l'existence du bâtiment
            db.get('SELECT id FROM batiments WHERE id = ?', [idBatiment], async (err, batiment) => {
                if (err) {
                    console.error('❌ [INCIDENT] Erreur vérification bâtiment:', err.message);
                    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
                }
                if (!batiment) {
                    console.error('❌ [INCIDENT] Bâtiment non trouvé:', idBatiment);
                    return res.status(404).json({ success: false, message: 'Bâtiment non trouvé.' });
                }

                console.log('✅ [INCIDENT] Bâtiment trouvé:', batiment);

                // Insertion de l'incident avec image et titre
                const query = `INSERT INTO incidents (type, title, description, date, image, status, idUtilisateur, idBatiment, etage, numero_porte) 
                               VALUES (?, ?, ?, ?, ?, 'nouveau', ?, ?, ?, ?)`;
                const params = [type, title || type, description, date, imagePath, idUtilisateur, idBatiment, etage, numero_porte];

                console.log('🔄 [INCIDENT] Insertion en cours...', { query, params });

                db.run(query, params, async function(err) {
                    if (err) {
                        console.error('❌ [INCIDENT] Erreur insertion:', err.message);
                        return res.status(500).json({ success: false, message: 'Erreur serveur.' });
                    }

                    const incidentId = this.lastID;
                    console.log('✅ [INCIDENT] Incident créé avec ID:', incidentId);

                    try {
                        // Ajouter à l'historique
                        await addToHistory(incidentId, 'Création', null, 'nouveau', 'Incident créé', idUtilisateur, req.user.role);

                        console.log('🎉 [INCIDENT] Incident créé avec succès!');
                        res.status(201).json({ 
                            success: true,
                            message: 'Incident signalé avec succès', 
                            incidentId,
                            imagePath
                        });

                    } catch (error) {
                        console.error('⚠️ [INCIDENT] Erreur:', error);
                        res.status(201).json({ 
                            success: true,
                            message: 'Incident signalé avec succès', 
                            incidentId,
                            imagePath
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.error('💥 [INCIDENT] Erreur générale:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};

// Obtenir tous les incidents (pour les gardiens)
const getAllIncidents = (req, res) => {
    const { status, building_id } = req.query;
    
    let query = `
        SELECT i.*, 
               l.nom as user_nom, l.prenom as user_prenom, l.email as user_email,
               b.nom as building_nom,
               g.nom as guardian_nom, g.prenom as guardian_prenom
        FROM incidents i
        LEFT JOIN locataire l ON i.idUtilisateur = l.id
        LEFT JOIN batiments b ON i.idBatiment = b.id
        LEFT JOIN guardians g ON i.assigned_guardian_id = g.id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
        query += ' AND i.status = ?';
        params.push(status);
    }
    
    if (building_id) {
        query += ' AND i.idBatiment = ?';
        params.push(building_id);
    }
    
    query += ' ORDER BY i.created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des incidents:', err.message);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.status(200).json({ success: true, incidents: rows });
    });
};

// Obtenir les incidents d'un utilisateur
const getIncidentsByUserId = (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: 'Paramètre userId invalide.' });
    }

    const query = `
        SELECT i.*, 
               b.nom as building_nom,
               g.nom as guardian_nom, g.prenom as guardian_prenom, g.telephone as guardian_phone
        FROM incidents i
        LEFT JOIN batiments b ON i.idBatiment = b.id
        LEFT JOIN guardians g ON i.assigned_guardian_id = g.id
        WHERE i.idUtilisateur = ?
        ORDER BY i.created_at DESC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des incidents:', err.message);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.status(200).json({ success: true, incidents: rows });
    });
};

// Mettre à jour un incident (pour les gardiens)
const updateIncident = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        if (isNaN(incidentId)) {
            return res.status(400).json({ success: false, message: 'ID incident invalide.' });
        }

        const parseResult = updateIncidentSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ 
                success: false,
                message: 'Données invalides', 
                errors: parseResult.error.errors 
            });
        }

        // Récupérer l'incident actuel
        db.get('SELECT * FROM incidents WHERE id = ?', [incidentId], async (err, currentIncident) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'incident:', err);
                return res.status(500).json({ success: false, message: 'Erreur serveur.' });
            }
            if (!currentIncident) {
                return res.status(404).json({ success: false, message: 'Incident non trouvé.' });
            }

            const updates = parseResult.data;
            const updateFields = [];
            const updateValues = [];

            // Construire la requête de mise à jour dynamiquement
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(updates[key]);
                }
            });

            if (updateFields.length === 0) {
                return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour.' });
            }

            // Ajouter les champs automatiques
            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            if (updates.status === 'resolu' && !currentIncident.resolved_at) {
                updateFields.push('resolved_at = CURRENT_TIMESTAMP');
            }

            updateValues.push(incidentId);

            const updateQuery = `UPDATE incidents SET ${updateFields.join(', ')} WHERE id = ?`;

            db.run(updateQuery, updateValues, async function(err) {
                if (err) {
                    console.error('Erreur lors de la mise à jour de l\'incident:', err);
                    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
                }

                try {
                    // Ajouter à l'historique
                    const action = updates.status ? 'Changement de statut' : 'Mise à jour';
                    await addToHistory(
                        incidentId, 
                        action, 
                        currentIncident.status, 
                        updates.status || currentIncident.status, 
                        updates.resolution_comment || 'Incident mis à jour',
                        req.user.id,
                        req.user.role
                    );

                    res.json({ 
                        success: true, 
                        message: 'Incident mis à jour avec succès',
                        changes: updates 
                    });

                } catch (error) {
                    console.error('Erreur lors de la création de l\'historique:', error);
                    res.json({ 
                        success: true, 
                        message: 'Incident mis à jour avec succès',
                        changes: updates 
                    });
                }
            });
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'incident:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};

// Obtenir l'historique d'un incident
const getIncidentHistory = (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId)) {
        return res.status(400).json({ success: false, message: 'ID incident invalide.' });
    }

    const query = `
        SELECT ih.*, 
               CASE 
                   WHEN ih.user_role = 'locataire' THEN l.nom || ' ' || l.prenom
                   WHEN ih.user_role = 'guardian' THEN g.nom || ' ' || g.prenom
               END as user_name
        FROM incident_history ih
        LEFT JOIN locataire l ON ih.user_id = l.id AND ih.user_role = 'locataire'
        LEFT JOIN guardians g ON ih.user_id = g.id AND ih.user_role = 'guardian'
        WHERE ih.incident_id = ?
        ORDER BY ih.created_at ASC
    `;

    db.all(query, [incidentId], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'historique:', err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.json({ success: true, history: rows });
    });
};

// Ajouter un commentaire à un incident
const addIncidentComment = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        const { comment } = req.body;

        if (isNaN(incidentId) || !comment) {
            return res.status(400).json({ success: false, message: 'ID incident et commentaire requis.' });
        }

        const query = `INSERT INTO incident_comments (incident_id, user_id, user_role, comment) VALUES (?, ?, ?, ?)`;
        
        db.run(query, [incidentId, req.user.id, req.user.role, comment], async function(err) {
            if (err) {
                console.error('Erreur lors de l\'ajout du commentaire:', err);
                return res.status(500).json({ success: false, message: 'Erreur serveur.' });
            }

            try {
                // Ajouter à l'historique
                await addToHistory(incidentId, 'Commentaire ajouté', null, null, comment, req.user.id, req.user.role);

                res.status(201).json({ 
                    success: true, 
                    message: 'Commentaire ajouté avec succès',
                    commentId: this.lastID 
                });
            } catch (error) {
                console.error('Erreur lors de l\'ajout à l\'historique:', error);
                res.status(201).json({ 
                    success: true, 
                    message: 'Commentaire ajouté avec succès (historique partiel)',
                    commentId: this.lastID 
                });
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};

// Obtenir les commentaires d'un incident
const getIncidentComments = (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId)) {
        return res.status(400).json({ success: false, message: 'ID incident invalide.' });
    }

    const query = `
        SELECT ic.*, 
               CASE 
                   WHEN ic.user_role = 'locataire' THEN l.nom || ' ' || l.prenom
                   WHEN ic.user_role = 'guardian' THEN g.nom || ' ' || g.prenom
               END as user_name
        FROM incident_comments ic
        LEFT JOIN locataire l ON ic.user_id = l.id AND ic.user_role = 'locataire'
        LEFT JOIN guardians g ON ic.user_id = g.id AND ic.user_role = 'guardian'
        WHERE ic.incident_id = ?
        ORDER BY ic.created_at ASC
    `;

    db.all(query, [incidentId], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des commentaires:', err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.json({ success: true, comments: rows });
    });
};

// Statistiques des incidents (pour les gardiens)
const getIncidentStats = (req, res) => {
    const { building_id } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (building_id) {
        whereClause = 'WHERE idBatiment = ?';
        params.push(building_id);
    }
    
    const query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'nouveau' THEN 1 ELSE 0 END) as nouveaux,
            SUM(CASE WHEN status = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
            SUM(CASE WHEN status = 'resolu' THEN 1 ELSE 0 END) as resolus,
            SUM(CASE WHEN status = 'ferme' THEN 1 ELSE 0 END) as fermes
        FROM incidents 
        ${whereClause}
    `;

    db.get(query, params, (err, stats) => {
        if (err) {
            console.error('Erreur lors de la récupération des statistiques:', err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.json({ success: true, stats });
    });
};

// Obtenir un incident par son ID
const getIncidentById = (req, res) => {
    const incidentId = parseInt(req.params.id, 10);
    if (isNaN(incidentId)) {
        return res.status(400).json({ success: false, message: 'ID incident invalide.' });
    }

    const query = `
        SELECT i.*, 
               l.nom as user_nom, l.prenom as user_prenom, l.email as user_email,
               b.nom as building_nom,
               g.nom as guardian_nom, g.prenom as guardian_prenom, g.telephone as guardian_phone
        FROM incidents i
        LEFT JOIN locataire l ON i.idUtilisateur = l.id
        LEFT JOIN batiments b ON i.idBatiment = b.id
        LEFT JOIN guardians g ON i.assigned_guardian_id = g.id
        WHERE i.id = ?
    `;

    db.get(query, [incidentId], (err, incident) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'incident:', err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        
        if (!incident) {
            return res.status(404).json({ success: false, message: 'Incident non trouvé.' });
        }

        res.json({ success: true, incident });
    });
};

module.exports = { 
    createIncident, 
    getAllIncidents, 
    getIncidentsByUserId,
    getIncidentById,
    updateIncident,
    getIncidentHistory,
    addIncidentComment,
    getIncidentComments,
    getIncidentStats
}; 