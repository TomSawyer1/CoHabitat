const multer = require('multer');
const path = require('path');
const fs = require('fs');

// S'assurer que le dossier uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Générer un nom de fichier unique avec timestamp et nom original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_'); // Nettoyer le nom
        
        cb(null, `incident_${uniqueSuffix}_${cleanBaseName}${ext}`);
    }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
    // Autoriser seulement les images
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
};

// Configuration multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
    fileFilter: fileFilter
});

// Middleware pour un seul fichier
const uploadSingle = upload.single('image');

// Middleware wrapper pour une meilleure gestion d'erreurs
const uploadMiddleware = (req, res, next) => {
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Fichier trop volumineux. Taille maximale : 5MB'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Erreur lors de l\'upload : ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

module.exports = {
    uploadMiddleware,
    uploadDir
}; 