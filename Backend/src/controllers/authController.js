const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../config/env');

const registerGuardian = async (req, res) => {
    const { email, nom, prenom, telephone, batiment, numeroGardien, password } = req.body;

    if (!email || !nom || !prenom || !telephone || !batiment || !numeroGardien || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO guardians (email, nom, prenom, telephone, batiments_id, guardian_number, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, numeroGardien, hashedPassword];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Erreur SQL détaillée:', err);
                if (err.message.includes('UNIQUE constraint failed: guardians.email')) {
                    return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
                }
                if (err.message.includes('UNIQUE constraint failed: guardians.guardian_number')) {
                    return res.status(409).json({ message: 'Ce numéro de gardien est déjà utilisé.' });
                }
                console.error('Erreur lors de l\'insertion du gardien:', err.message);
                return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
            }
            console.log('Gardien inséré avec succès, ID:', this.lastID);
            res.status(201).json({ message: 'Inscription du gardien réussie!', userId: this.lastID });
        });
    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
};

const registerLocataire = async (req, res) => {
    const { email, nom, prenom, telephone, batiment, password } = req.body;

    if (!email || !nom || !prenom || !telephone || !batiment || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO locataire (email, nom, prenom, telephone, batiments_id, password) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, hashedPassword];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Erreur SQL détaillée:', err);
                if (err.message.includes('UNIQUE constraint failed: locataire.email')) {
                    return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
                }
                console.error('Erreur lors de l\'insertion du locataire:', err.message);
                return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
            }
            console.log('Locataire inséré avec succès, ID:', this.lastID);
            res.status(201).json({ message: 'Inscription du locataire réussie!', userId: this.lastID });
        });
    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Email, mot de passe et rôle requis'
            });
        }

        // Déterminer la table en fonction du rôle
        const table = role === 'locataire' ? 'locataire' : 
                     role === 'guardian' ? 'guardians' : null;

        if (!table) {
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide'
            });
        }

        // Rechercher l'utilisateur dans la base de données avec les infos du bâtiment
        const query = `
            SELECT u.*, b.nom as building_name, b.rue as building_address
            FROM ${table} u
            LEFT JOIN batiments b ON u.batiments_id = b.id
            WHERE u.email = ?
        `;
        
        db.get(query, [email], async (err, user) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la recherche de l\'utilisateur'
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email,
                    role: role,
                    building_id: user.batiments_id
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retourner les informations complètes de l'utilisateur
            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom,
                    telephone: user.telephone,
                    role: role,
                    building_id: user.batiments_id,
                    building_name: user.building_name,
                    building_address: user.building_address
                }
            });
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
};

const getLocataireInfo = async (req, res) => {
    const { id } = req.params;

    // Contrôle d'autorisation : un locataire ne peut consulter que son propre profil.
    // Les gardiens passent par d'autres routes (résidents du bâtiment).
    if (req.user.role !== 'locataire' || String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    try {
        const query = `
            SELECT l.*, b.nom as batiment_nom 
            FROM locataire l 
            LEFT JOIN batiments b ON l.batiments_id = b.id 
            WHERE l.id = ?
        `;
        
        db.get(query, [id], (err, locataire) => {
            if (err) {
                console.error('Erreur lors de la récupération des informations du locataire:', err);
                return res.status(500).json({ message: 'Erreur serveur.' });
            }
            if (!locataire) {
                return res.status(404).json({ message: 'Locataire non trouvé.' });
            }

            // Ne pas renvoyer le mot de passe
            const { password, ...locataireInfo } = locataire;
            res.status(200).json(locataireInfo);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const getGuardianInfo = async (req, res) => {
    const { id } = req.params;

    // Contrôle d'autorisation : un gardien ne peut consulter que son propre profil.
    // (Un locataire qui voudrait afficher son gardien doit passer par
    //  /api/buildings/:userId qui retourne les infos publiques utiles.)
    if (req.user.role !== 'guardian' || String(req.user.id) !== String(id)) {
        return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
    }

    try {
        const query = `
            SELECT g.*, b.nom as batiment_nom 
            FROM guardians g 
            LEFT JOIN batiments b ON g.batiments_id = b.id 
            WHERE g.id = ?
        `;
        
        db.get(query, [id], (err, guardian) => {
            if (err) {
                console.error('Erreur lors de la récupération des informations du gardien:', err);
                return res.status(500).json({ success: false, message: 'Erreur serveur.' });
            }
            if (!guardian) {
                return res.status(404).json({ success: false, message: 'Gardien non trouvé.' });
            }

            // Ne pas renvoyer le mot de passe
            const { password, ...guardianInfo } = guardian;
            res.json({ success: true, guardian: guardianInfo });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du gardien:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};

// Mettre à jour le profil d'un locataire
const updateLocataireProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { nom, prenom, telephone } = req.body;

        console.log('💾 [UPDATE_PROFILE] Début mise à jour:', { 
            userId, 
            userRole, 
            nom, 
            prenom, 
            telephone 
        });

        if (!nom || !prenom) {
            console.error('❌ [UPDATE_PROFILE] Champs manquants:', { nom: !!nom, prenom: !!prenom });
            return res.status(400).json({ 
                success: false, 
                message: 'Le nom et le prénom sont requis.' 
            });
        }

        const query = `
            UPDATE locataire 
            SET nom = ?, prenom = ?, telephone = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const params = [nom, prenom, telephone, userId];

        console.log('📊 [UPDATE_PROFILE] Exécution requête:', { query, params });

        db.run(query, params, function(err) {
            if (err) {
                console.error('❌ [UPDATE_PROFILE] Erreur SQL:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la mise à jour du profil.' 
                });
            }

            console.log('📊 [UPDATE_PROFILE] Résultat:', { 
                changes: this.changes, 
                lastID: this.lastID 
            });

            if (this.changes === 0) {
                console.error('❌ [UPDATE_PROFILE] Aucune ligne modifiée pour userId:', userId);
                return res.status(404).json({ 
                    success: false, 
                    message: 'Utilisateur non trouvé.' 
                });
            }

            console.log('✅ [UPDATE_PROFILE] Profil mis à jour avec succès');
            res.json({ 
                success: true, 
                message: 'Profil mis à jour avec succès.',
                changes: this.changes
            });
        });
    } catch (error) {
        console.error('💥 [UPDATE_PROFILE] Erreur générale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur.' 
        });
    }
};

// Mettre à jour le profil d'un gardien
const updateGuardianProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nom, prenom, telephone } = req.body;

        if (!nom || !prenom) {
            return res.status(400).json({ 
                success: false, 
                message: 'Le nom et le prénom sont requis.' 
            });
        }

        const query = `
            UPDATE guardians 
            SET nom = ?, prenom = ?, telephone = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;

        db.run(query, [nom, prenom, telephone, userId], function(err) {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la mise à jour du profil.' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Utilisateur non trouvé.' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Profil mis à jour avec succès.' 
            });
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur.' 
        });
    }
};

// Changer le mot de passe d'un utilisateur
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'L\'ancien et le nouveau mot de passe sont requis.' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' 
            });
        }

        const table = userRole === 'locataire' ? 'locataire' : 'guardians';
        
        // Récupérer le mot de passe actuel
        db.get(`SELECT password FROM ${table} WHERE id = ?`, [userId], async (err, user) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur serveur.' 
                });
            }

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Utilisateur non trouvé.' 
                });
            }

            // Vérifier l'ancien mot de passe
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Mot de passe actuel incorrect.' 
                });
            }

            // Hacher le nouveau mot de passe
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Mettre à jour le mot de passe
            const updateQuery = `UPDATE ${table} SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            db.run(updateQuery, [hashedNewPassword, userId], function(err) {
                if (err) {
                    console.error('Erreur lors de la mise à jour du mot de passe:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Erreur lors de la mise à jour du mot de passe.' 
                    });
                }

                res.json({ 
                    success: true, 
                    message: 'Mot de passe modifié avec succès.' 
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur.' 
        });
    }
};

// Obtenir le profil de l'utilisateur connecté
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        
        console.log('📱 [PROFILE] Récupération profil:', { userId, userRole });

        // Déterminer la table en fonction du rôle
        const table = userRole === 'locataire' ? 'locataire' : 'guardians';
        
        // Récupérer les informations de l'utilisateur avec le bâtiment
        const query = `
            SELECT u.*, b.nom as building_name, b.rue as building_address
            FROM ${table} u
            LEFT JOIN batiments b ON u.batiments_id = b.id
            WHERE u.id = ?
        `;
        
        db.get(query, [userId], (err, user) => {
            if (err) {
                console.error('❌ [PROFILE] Erreur SQL:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la récupération du profil'
                });
            }

            if (!user) {
                console.error('❌ [PROFILE] Utilisateur non trouvé:', userId);
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            console.log('✅ [PROFILE] Profil trouvé:', { 
                id: user.id, 
                email: user.email, 
                building: user.building_name 
            });

            // Supprimer le mot de passe de la réponse
            const { password, ...userProfile } = user;
            
            res.json({
                success: true,
                user: {
                    ...userProfile,
                    role: userRole,
                    building_id: user.batiments_id,
                    building_name: user.building_name,
                    building_address: user.building_address
                }
            });
        });
    } catch (error) {
        console.error('❌ [PROFILE] Erreur générale:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

// Obtenir la liste des locataires d'un bâtiment (pour les gardiens)
const getBuildingResidents = async (req, res) => {
    try {
        if (req.user.role !== 'guardian') {
            return res.status(403).json({ 
                success: false, 
                message: 'Accès non autorisé. Réservé aux gardiens.' 
            });
        }

        const buildingId = req.params.buildingId;

        // Vérifier que le gardien est bien assigné à ce bâtiment
        db.get('SELECT batiments_id FROM guardians WHERE id = ?', [req.user.id], (err, guardian) => {
            if (err) {
                console.error('Erreur lors de la vérification du gardien:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur serveur.' 
                });
            }

            if (!guardian || guardian.batiments_id != buildingId) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Accès non autorisé à ce bâtiment.' 
                });
            }

            // Récupérer la liste des locataires
            const query = `
                SELECT l.id, l.nom, l.prenom, l.email, l.telephone, l.created_at
                FROM locataire l
                WHERE l.batiments_id = ?
                ORDER BY l.nom, l.prenom
            `;

            db.all(query, [buildingId], (err, residents) => {
                if (err) {
                    console.error('Erreur lors de la récupération des locataires:', err);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Erreur serveur.' 
                    });
                }

                res.json({ 
                    success: true, 
                    residents 
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des locataires:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur.' 
        });
    }
};

// Supprimer le compte de l'utilisateur connecté
const deleteMyAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const table = userRole === 'locataire' ? 'locataire' : 'guardians';

        const query = `DELETE FROM ${table} WHERE id = ?`;
        db.run(query, [userId], function(err) {
            if (err) {
                console.error('Erreur lors de la suppression du compte:', err);
                return res.status(500).json({ success: false, message: 'Erreur lors de la suppression du compte.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
            }
            res.json({ success: true, message: 'Compte supprimé avec succès.' });
        });
    } catch (error) {
        console.error('Erreur générale lors de la suppression du compte:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
};

module.exports = {
    registerGuardian,
    registerLocataire,
    login,
    getLocataireInfo,
    getGuardianInfo,
    updateLocataireProfile,
    updateGuardianProfile,
    changePassword,
    getMyProfile,
    getBuildingResidents,
    deleteMyAccount
}; 