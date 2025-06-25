const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'guardconnect_secret_key_2024'; // Utilise la variable d'environnement ou la valeur par défaut

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Accès non autorisé. Token manquant.' 
            });
        }

        console.log('Clé secrète utilisée par le middleware:', JWT_SECRET); // Temporaire pour le débogage
        const decoded = jwt.verify(token, JWT_SECRET);
        // Stocker toutes les informations du token dans req.user
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        
        console.log('Token décodé:', decoded); // Log pour déboguer
        console.log('User stocké:', req.user); // Log pour déboguer
        
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