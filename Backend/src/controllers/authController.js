const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'guardconnect_secret_key_2024'; // À remplacer par une variable d'environnement en production

const registerGuardian = async (req, res) => {
    console.log('Données reçues:', req.body);
    const { email, nom, prenom, telephone, batiment, numeroGardien, password } = req.body;

    if (!email || !nom || !prenom || !telephone || !batiment || !numeroGardien || !password) {
        console.log('Champs manquants:', {
            email: !email,
            nom: !nom,
            prenom: !prenom,
            telephone: !telephone,
            batiment: !batiment,
            numeroGardien: !numeroGardien,
            password: !password
        });
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Mot de passe haché avec succès');

        const query = `INSERT INTO guardians (email, nom, prenom, telephone, building_id, guardian_number, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, numeroGardien, hashedPassword];
        
        console.log('Exécution de la requête SQL:', query);
        console.log('Paramètres:', params);

        db.run(query, params, function (err) {
            if (err) {
                console.error('Erreur SQL détaillée:', err);
                if (err.message.includes('UNIQUE constraint failed: guardians.email')) {
                    return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
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
    console.log('Données reçues:', req.body);
    const { email, nom, prenom, telephone, batiment, password } = req.body;

    if (!email || !nom || !prenom || !telephone || !batiment || !password) {
        console.log('Champs manquants:', {
            email: !email,
            nom: !nom,
            prenom: !prenom,
            telephone: !telephone,
            batiment: !batiment,
            password: !password
        });
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        console.log('Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Mot de passe haché avec succès');

        const query = `INSERT INTO locataire (email, nom, prenom, telephone, building_id, password) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [email, nom, prenom, telephone, batiment, hashedPassword];
        
        console.log('Exécution de la requête SQL:', query);
        console.log('Paramètres:', params);

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

        // Rechercher l'utilisateur dans la base de données
        const query = `SELECT * FROM ${table} WHERE email = ?`;
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
                    role: role
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Retourner les informations de l'utilisateur et le token
            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: role
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

    try {
        const query = `
            SELECT l.*, b.nom as batiment_nom 
            FROM locataire l 
            LEFT JOIN batiments b ON l.building_id = b.id 
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

module.exports = {
    registerGuardian,
    registerLocataire,
    login,
    getLocataireInfo
}; 