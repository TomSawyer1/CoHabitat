const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

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
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            building_id: decoded.building_id ?? decoded.batiments_id ?? null,
        };

        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Token invalide ou expiré.' 
        });
    }
};

module.exports = auth; 