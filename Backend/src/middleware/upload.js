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

// Vérification des magic bytes : l'extension et le MIME type sont fournis par
// le client et peuvent être falsifiés. On lit les premiers octets du fichier
// réellement écrit sur disque pour s'assurer que c'est bien une image.
const MAGIC_SIGNATURES = [
    { type: 'jpeg', check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    { type: 'png', check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
    { type: 'gif', check: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
    {
        type: 'webp',
        check: (b) =>
            b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // "RIFF"
            b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50, // "WEBP"
    },
];

const isRealImage = (filePath) => {
    let fd;
    try {
        fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(12);
        fs.readSync(fd, buffer, 0, 12, 0);
        return MAGIC_SIGNATURES.some((sig) => sig.check(buffer));
    } catch {
        return false;
    } finally {
        if (fd !== undefined) fs.closeSync(fd);
    }
};

// Middleware wrapper pour une meilleure gestion d'erreurs.
// On distingue 3 cas :
//   1. MulterError connue (taille, champ inattendu, …) → 400 explicite
//   2. Erreur custom du fileFilter (mauvais type MIME) → 400
//   3. Toute autre erreur (FS, permissions, …) → 500 sans détail technique
const uploadMiddleware = (req, res, next) => {
    uploadSingle(req, res, function (err) {
        if (!err) {
            // Le fichier est déjà sur disque : on valide son contenu réel et on
            // le supprime immédiatement si ce n'est pas une image.
            if (req.file && !isRealImage(req.file.path)) {
                fs.unlink(req.file.path, () => {});
                req.file = undefined;
                return res.status(400).json({
                    success: false,
                    message: 'Le fichier envoyé n\'est pas une image valide.'
                });
            }
            return next();
        }

        if (err instanceof multer.MulterError) {
            const messages = {
                LIMIT_FILE_SIZE: 'Fichier trop volumineux. Taille maximale : 5MB.',
                LIMIT_UNEXPECTED_FILE: 'Champ de fichier inattendu (attendu : "image").',
                LIMIT_FILE_COUNT: 'Trop de fichiers envoyés.',
            };
            return res.status(400).json({
                success: false,
                message: messages[err.code] || `Erreur lors de l'upload : ${err.message}`
            });
        }

        // Erreur levée par notre fileFilter (type MIME interdit)
        if (err.message && err.message.includes('Seules les images sont autorisées')) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Erreur imprévue (FS, permissions, …) : on log côté serveur mais on
        // ne renvoie pas la stack au client.
        console.error('Erreur upload inattendue:', err);
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors du traitement du fichier.'
        });
    });
};

module.exports = {
    uploadMiddleware,
    uploadDir
}; 