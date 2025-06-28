const db = require('../db/database');

const getAllBuildings = (req, res) => {
    const query = 'SELECT id, nom FROM batiments ORDER BY nom';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des bâtiments:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur lors de la récupération des bâtiments.' 
            });
        }
        res.status(200).json({ 
            success: true, 
            buildings: rows 
        });
    });
};

const getBuildingInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRole = req.user.role;

        // Déterminer la table et le champ en fonction du rôle
        const table = userRole === 'locataire' ? 'locataire' : 'guardians';
        const buildingIdField = userRole === 'locataire' ? 'batiments_id' : 'building_id';

        // Récupérer l'ID du bâtiment de l'utilisateur
        const userQuery = `SELECT ${buildingIdField} FROM ${table} WHERE id = ?`;

        db.get(userQuery, [userId], (err, user) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la récupération des informations'
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Récupérer les informations du bâtiment
            const buildingQuery = `
                SELECT b.*, g.nom as guardian_name, g.prenom as guardian_prenom,
                       g.telephone as guardian_phone, g.email as guardian_email
                FROM batiments b
                LEFT JOIN guardians g ON b.id_guardians = g.id
                WHERE b.id = ?
            `;

            db.get(buildingQuery, [user[buildingIdField]], (err, building) => {
                if (err) {
                    console.error('Erreur lors de la récupération du bâtiment:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur lors de la récupération des informations'
                    });
                }

                if (!building) {
                    return res.status(404).json({
                        success: false,
                        message: 'Bâtiment non trouvé'
                    });
                }

                // Formater la réponse
                const response = {
                    id: building.id,
                    name: building.nom || 'Non spécifié',
                    address: building.rue || 'Non spécifiée',
                    floors: building.nombre_etage || 0,
                    totalApartments: building.nombre_appartement || 0,
                    yearBuilt: building.annee_construction || 'Non spécifiée',
                    lastRenovation: building.derniere_renovation || 'Non spécifiée',
                    facilities: building.equipements ? JSON.parse(building.equipements) : [],
                    rules: building.reglement || 'Règlement non disponible',
                    guardian: (building.guardian_name && building.guardian_prenom) ? {
                        name: `${building.guardian_prenom} ${building.guardian_name}`,
                        phone: building.guardian_phone || 'Non disponible',
                        email: building.guardian_email || 'Non disponible'
                    } : null,
                    emergency: {
                        guardian: building.guardian_phone || 'Non disponible',
                        security: building.telephone_securite || 'Non disponible'
                    }
                };

                res.json({ 
                    success: true, 
                    building: response 
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des informations'
        });
    }
};

// Obtenir les détails complets d'un bâtiment (pour les gardiens)
const getBuildingDetails = async (req, res) => {
    try {
        const buildingId = req.params.id;

        // Vérifier que l'utilisateur est un gardien et qu'il a accès à ce bâtiment
        if (req.user.role !== 'guardian') {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé. Réservé aux gardiens.'
            });
        }

        // Vérifier que le gardien est assigné à ce bâtiment
        db.get('SELECT building_id FROM guardians WHERE id = ?', [req.user.id], (err, guardian) => {
            if (err) {
                console.error('Erreur lors de la vérification du gardien:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur serveur.'
                });
            }

            if (!guardian || guardian.building_id != buildingId) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé à ce bâtiment.'
                });
            }

            // Récupérer les informations complètes du bâtiment
            const buildingQuery = `
                SELECT b.*, 
                       COUNT(DISTINCT l.id) as total_locataires,
                       COUNT(DISTINCT i.id) as total_incidents,
                       COUNT(DISTINCT CASE WHEN i.status = 'nouveau' THEN i.id END) as incidents_nouveaux
                FROM batiments b
                LEFT JOIN locataire l ON b.id = l.batiments_id
                LEFT JOIN incidents i ON b.id = i.idBatiment
                WHERE b.id = ?
                GROUP BY b.id
            `;

            db.get(buildingQuery, [buildingId], (err, building) => {
                if (err) {
                    console.error('Erreur lors de la récupération du bâtiment:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur serveur.'
                    });
                }

                if (!building) {
                    return res.status(404).json({
                        success: false,
                        message: 'Bâtiment non trouvé.'
                    });
                }

                // Formater la réponse avec toutes les informations
                const response = {
                    id: building.id,
                    nom: building.nom,
                    rue: building.rue,
                    nombre_etage: building.nombre_etage,
                    nombre_appartement: building.nombre_appartement,
                    annee_construction: building.annee_construction,
                    derniere_renovation: building.derniere_renovation,
                    equipements: building.equipements ? JSON.parse(building.equipements) : [],
                    reglement: building.reglement,
                    statistics: {
                        total_locataires: building.total_locataires || 0,
                        total_incidents: building.total_incidents || 0,
                        incidents_nouveaux: building.incidents_nouveaux || 0
                    },
                    created_at: building.created_at,
                    updated_at: building.updated_at
                };

                res.json({
                    success: true,
                    building: response
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du bâtiment:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur.'
        });
    }
};

// Mettre à jour les informations d'un bâtiment (pour les gardiens)
const updateBuildingInfo = async (req, res) => {
    try {
        const buildingId = req.params.id;
        const { reglement, equipements } = req.body;

        // Vérifier que l'utilisateur est un gardien
        if (req.user.role !== 'guardian') {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé. Réservé aux gardiens.'
            });
        }

        // Vérifier que le gardien est assigné à ce bâtiment
        db.get('SELECT building_id FROM guardians WHERE id = ?', [req.user.id], (err, guardian) => {
            if (err) {
                console.error('Erreur lors de la vérification du gardien:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur serveur.'
                });
            }

            if (!guardian || guardian.building_id != buildingId) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé à ce bâtiment.'
                });
            }

            // Construire la requête de mise à jour
            const updateFields = [];
            const updateValues = [];

            if (reglement !== undefined) {
                updateFields.push('reglement = ?');
                updateValues.push(reglement);
            }

            if (equipements !== undefined) {
                updateFields.push('equipements = ?');
                updateValues.push(JSON.stringify(equipements));
            }

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Aucune donnée à mettre à jour.'
                });
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateValues.push(buildingId);

            const updateQuery = `UPDATE batiments SET ${updateFields.join(', ')} WHERE id = ?`;

            db.run(updateQuery, updateValues, function(err) {
                if (err) {
                    console.error('Erreur lors de la mise à jour du bâtiment:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur lors de la mise à jour.'
                    });
                }

                if (this.changes === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Bâtiment non trouvé.'
                    });
                }

                res.json({
                    success: true,
                    message: 'Informations du bâtiment mises à jour avec succès.'
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du bâtiment:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur.'
        });
    }
};

module.exports = {
    getAllBuildings,
    getBuildingInfo,
    getBuildingDetails,
    updateBuildingInfo
}; 