const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const db = require('../db/database');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé. Token manquant.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const role = decoded.role === 'locataire' ? 'locataire' : 'guardian';
        const table = role === 'locataire' ? 'locataire' : 'guardians';

        // On revérifie l'utilisateur en BDD à chaque requête :
        //  - le statut peut avoir changé depuis l'émission du JWT (suspension /
        //    bannissement via le back-office) ;
        //  - le batiments_id fait foi côté BDD, jamais côté token (un token
        //    forgé ou obsolète ne doit pas donner accès à un autre bâtiment).
        db.get(
            `SELECT id, email, status, batiments_id FROM ${table} WHERE id = ?`,
            [decoded.id],
            (err, user) => {
                if (err) {
                    console.error('Erreur BDD lors de la vérification du token:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur serveur.'
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Compte introuvable.'
                    });
                }

                if (user.status && user.status !== 'active') {
                    return res.status(403).json({
                        success: false,
                        message: 'Ce compte est suspendu ou banni. Contactez l\'administration.'
                    });
                }

                req.user = {
                    id: user.id,
                    email: user.email,
                    role: decoded.role,
                    building_id: user.batiments_id ?? null,
                };

                next();
            }
        );
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Erreur de vérification du token:', error.message);
        }
        res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré.'
        });
    }
};

module.exports = auth;
