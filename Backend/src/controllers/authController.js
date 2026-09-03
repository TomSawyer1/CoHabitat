const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../db/database');
const { JWT_SECRET } = require('../config/env');

// === Schémas de validation Zod ===
// Politique de mot de passe : >= 8 caractères, au moins 1 chiffre et 1 lettre.
const passwordSchema = z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .max(128, 'Le mot de passe est trop long.')
    .regex(/[A-Za-z]/, 'Le mot de passe doit contenir au moins une lettre.')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.');

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email('Email invalide.')
    .max(254);

const phoneSchema = z
    .string()
    .trim()
    .min(6, 'Numéro de téléphone trop court.')
    .max(20, 'Numéro de téléphone trop long.');

const nameSchema = z.string().trim().min(1, 'Champ requis.').max(80);

const registerLocataireSchema = z.object({
    email: emailSchema,
    nom: nameSchema,
    prenom: nameSchema,
    telephone: phoneSchema,
    batiment: z.union([z.string(), z.number()]).transform((v) => String(v)),
    password: passwordSchema,
});

const registerGuardianSchema = registerLocataireSchema.extend({
    numeroGardien: z.string().trim().min(1).max(50),
});

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Mot de passe requis.'),
    role: z.enum(['locataire', 'guardian'], {
        errorMap: () => ({ message: 'Rôle invalide (attendu : locataire ou guardian).' }),
    }),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis.'),
    newPassword: passwordSchema,
});

const updateProfileSchema = z.object({
    nom: nameSchema,
    prenom: nameSchema,
    telephone: phoneSchema.optional().or(z.literal('')),
});

const sendValidationError = (res, parseResult) => {
    const firstError = parseResult.error.errors[0];
    return res.status(400).json({
        success: false,
        message: firstError ? firstError.message : 'Données invalides.',
        errors: parseResult.error.errors,
    });
};

const registerGuardian = async (req, res) => {
    const parseResult = registerGuardianSchema.safeParse(req.body);
    if (!parseResult.success) {
        return sendValidationError(res, parseResult);
    }
    const { email, nom, prenom, telephone, batiment, numeroGardien, password } = parseResult.data;

    // Liste blanche des numéros de gardien (SEC-06) : si GUARDIAN_ALLOWED_NUMBERS
    // est défini (liste séparée par des virgules), seuls ces numéros peuvent
    // créer un compte gardien. Sans cette variable, l'inscription reste ouverte
    // (mode démo) mais un avertissement est loggé au démarrage.
    const allowedNumbers = (process.env.GUARDIAN_ALLOWED_NUMBERS || '')
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
    if (allowedNumbers.length > 0 && !allowedNumbers.includes(numeroGardien)) {
        return res.status(403).json({
            success: false,
            message: 'Numéro de gardien non reconnu. Contactez l\'administration.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO guardians (email, nom, prenom, telephone, batiments_id, guardian_number, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, numeroGardien, hashedPassword];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Erreur SQL détaillée:', err);
                if (err.message.includes('UNIQUE constraint failed: guardians.email')) {
                    return res.status(409).json({ success: false, message: 'Cet email est déjà enregistré.' });
                }
                if (err.message.includes('UNIQUE constraint failed: guardians.guardian_number')) {
                    return res.status(409).json({ success: false, message: 'Ce numéro de gardien est déjà utilisé.' });
                }
                console.error('Erreur lors de l\'insertion du gardien:', err.message);
                return res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'inscription.' });
            }
            console.log('Gardien inséré avec succès, ID:', this.lastID);
            res.status(201).json({ success: true, message: 'Inscription du gardien réussie!', userId: this.lastID });
        });
    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
};

const registerLocataire = async (req, res) => {
    const parseResult = registerLocataireSchema.safeParse(req.body);
    if (!parseResult.success) {
        return sendValidationError(res, parseResult);
    }
    const { email, nom, prenom, telephone, batiment, password } = parseResult.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO locataire (email, nom, prenom, telephone, batiments_id, password) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, hashedPassword];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Erreur SQL détaillée:', err);
                if (err.message.includes('UNIQUE constraint failed: locataire.email')) {
                    return res.status(409).json({ success: false, message: 'Cet email est déjà enregistré.' });
                }
                console.error('Erreur lors de l\'insertion du locataire:', err.message);
                return res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'inscription.' });
            }
            console.log('Locataire inséré avec succès, ID:', this.lastID);
            res.status(201).json({ success: true, message: 'Inscription du locataire réussie!', userId: this.lastID });
        });
    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
};

const login = async (req, res) => {
    try {
        const parseResult = loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            return sendValidationError(res, parseResult);
        }
        const { email, password, role } = parseResult.data;

        // Le rôle est déjà validé par le schéma (locataire | guardian)
        const table = role === 'locataire' ? 'locataire' : 'guardians';

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

            // Refuser les comptes suspendus ou bannis (gérés via le back-office).
            // Vérifié après le mot de passe pour ne pas révéler l'existence du
            // compte à un tiers.
            if (user.status && user.status !== 'active') {
                return res.status(403).json({
                    success: false,
                    message: 'Ce compte est suspendu ou banni. Contactez l\'administration.'
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

        const parseResult = updateProfileSchema.safeParse(req.body);
        if (!parseResult.success) {
            return sendValidationError(res, parseResult);
        }
        const { nom, prenom, telephone } = parseResult.data;

        const query = `
            UPDATE locataire 
            SET nom = ?, prenom = ?, telephone = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const params = [nom, prenom, telephone || null, userId];

        db.run(query, params, function(err) {
            if (err) {
                console.error('Erreur lors de la mise à jour du profil locataire:', err);
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
                message: 'Profil mis à jour avec succès.',
                changes: this.changes
            });
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil locataire:', error);
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

        const parseResult = updateProfileSchema.safeParse(req.body);
        if (!parseResult.success) {
            return sendValidationError(res, parseResult);
        }
        const { nom, prenom, telephone } = parseResult.data;

        const query = `
            UPDATE guardians 
            SET nom = ?, prenom = ?, telephone = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;

        db.run(query, [nom, prenom, telephone || null, userId], function(err) {
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

        const parseResult = changePasswordSchema.safeParse(req.body);
        if (!parseResult.success) {
            return sendValidationError(res, parseResult);
        }
        const { currentPassword, newPassword } = parseResult.data;

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
        
        if (process.env.NODE_ENV !== 'production') {
            console.log('📱 [PROFILE] Récupération profil:', { userId, userRole });
        }

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

            if (process.env.NODE_ENV !== 'production') {
                // Pas d'email ni d'autre donnée personnelle dans les logs.
                console.log('✅ [PROFILE] Profil trouvé:', { id: user.id });
            }

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

// Supprimer le compte de l'utilisateur connecté (avec cascade : incidents,
// commentaires et historique associés, pour ne pas laisser de lignes orphelines).
const deleteMyAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const table = userRole === 'locataire' ? 'locataire' : 'guardians';

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            if (userRole === 'locataire') {
                // Purge des données liées aux incidents du locataire, puis des
                // incidents eux-mêmes, puis de ses commentaires sur d'autres incidents.
                db.run(`DELETE FROM incident_comments WHERE incident_id IN (SELECT id FROM incidents WHERE idUtilisateur = ?)`, [userId]);
                db.run(`DELETE FROM incident_history WHERE incident_id IN (SELECT id FROM incidents WHERE idUtilisateur = ?)`, [userId]);
                db.run(`DELETE FROM incidents WHERE idUtilisateur = ?`, [userId]);
                db.run(`DELETE FROM incident_comments WHERE user_id = ? AND user_role = 'locataire'`, [userId]);
            } else {
                // Un gardien ne possède pas d'incidents : on détache ses références.
                db.run(`UPDATE incidents SET assigned_guardian_id = NULL WHERE assigned_guardian_id = ?`, [userId]);
                db.run(`UPDATE batiments SET id_guardians = NULL WHERE id_guardians = ?`, [userId]);
                db.run(`DELETE FROM incident_comments WHERE user_id = ? AND user_role = 'guardian'`, [userId]);
            }

            db.run(`DELETE FROM ${table} WHERE id = ?`, [userId], function (err) {
                if (err) {
                    console.error('Erreur lors de la suppression du compte:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ success: false, message: 'Erreur lors de la suppression du compte.' });
                }
                if (this.changes === 0) {
                    db.run('ROLLBACK');
                    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
                }
                db.run('COMMIT', (commitErr) => {
                    if (commitErr) {
                        console.error('Erreur lors du commit de la suppression:', commitErr);
                        db.run('ROLLBACK');
                        return res.status(500).json({ success: false, message: 'Erreur lors de la suppression du compte.' });
                    }
                    res.json({ success: true, message: 'Compte supprimé avec succès.' });
                });
            });
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