const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cohabitat_secret_key_2024'; // Utilise la variable d'environnement ou la valeur par défaut

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
            role: decoded.role
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