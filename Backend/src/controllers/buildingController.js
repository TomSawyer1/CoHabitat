const db = require('../db/database');

const getAllBuildings = (req, res) => {
    const query = 'SELECT id, nom FROM batiments';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des bâtiments:', err.message);
            return res.status(500).json({ message: 'Erreur serveur lors de la récupération des bâtiments.' });
        }
        res.status(200).json(rows);
    });
};

const getBuildingInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRole = req.user.role;

        // Déterminer la table et le champ en fonction du rôle
        const table = userRole === 'locataire' ? 'locataire' : 'guardians';
        const buildingIdField = 'building_id';

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
                SELECT b.*, g.nom as guardian_name, g.telephone as guardian_phone, 
                       g.email as guardian_email
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
                    name: building.nom || 'Non spécifié',
                    address: building.rue || 'Non spécifiée',
                    floors: building.nombre_etage || 0,
                    totalApartments: building.nombre_appartement || 0,
                    yearBuilt: building.annee_construction || 'Non spécifiée',
                    lastRenovation: building.derniere_renovation || 'Non spécifiée',
                    facilities: building.equipements ? JSON.parse(building.equipements) : [],
                    guardian: building.guardian_name ? {
                        name: building.guardian_name,
                        phone: building.guardian_phone,
                        email: building.guardian_email
                    } : null,
                    emergency: {
                        guardian: building.guardian_phone || 'Non disponible',
                        security: building.telephone_securite || 'Non disponible'
                    }
                };

                res.json(response);
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

module.exports = {
    getAllBuildings,
    getBuildingInfo
}; 