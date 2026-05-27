const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const { CORS_ORIGINS, NODE_ENV } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const incidentsRoutes = require('./routes/incidentsRoutes');

const app = express();

app.use(helmet({
    // Les images uploadées sont servies depuis ce même serveur ; on autorise
    // le chargement cross-origin pour l'app mobile / web.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '1mb' }));

app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
}));

// Limite les tentatives de brute force sur l'authentification.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Trop de tentatives. Réessayez dans 15 minutes.',
    },
});
app.use('/auth', authLimiter);

// Servir les images statiques depuis le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de logging détaillé des requêtes (mode développement uniquement)
// ⚠️ Les champs sensibles (password, currentPassword, newPassword, token, Authorization) sont masqués.
const SENSITIVE_BODY_KEYS = ['password', 'currentPassword', 'newPassword', 'confirmPassword'];
const SENSITIVE_HEADER_KEYS = ['authorization', 'cookie', 'x-api-key'];

const redact = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return obj;
    const clone = { ...obj };
    for (const k of Object.keys(clone)) {
        if (keys.includes(k.toLowerCase())) clone[k] = '[REDACTED]';
    }
    return clone;
};

app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[${req.method}] ${req.url}`);
        if (req.body && Object.keys(req.body).length > 0) {
            console.log('  body:', redact(req.body, SENSITIVE_BODY_KEYS));
        }
    }
    next();
});

// Route de santé pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CoHabitat API is running',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 3000,
        version: '1.0.0'
    });
});

// === Routes de l'API ===

// Routes d'authentification et gestion des utilisateurs
app.use('/auth', authRoutes);

// Routes des bâtiments
app.use('/api', buildingRoutes);

// Routes des incidents et signalements
app.use('/api', incidentsRoutes);

// Route pour les informations générales de l'API
app.get('/api/info', (req, res) => {
    res.json({
        name: 'CoHabitat API',
        version: '1.0.0',
        description: 'API pour la gestion des bâtiments résidentiels',
        endpoints: {
            auth: '/auth/*',
            buildings: '/api/buildings',
            incidents: '/api/incidents',
            uploads: '/uploads/*'
        },
        status: 'Production Ready'
    });
});

// Middleware pour les routes non trouvées.
// On n'utilise pas app.use('*', …) car path-to-regexp v6 (Express 5) le rejette.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        requested_url: req.originalUrl,
        available_routes: [
            'GET /health',
            'GET /api/info',
            'POST /auth/login',
            'POST /auth/register/locataire',
            'POST /auth/register/guardian',
            'GET /api/buildings',
            'POST /api/incidents',
            'GET /uploads/:filename'
        ]
    });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('\n=== Erreur Serveur ===');
    console.error(`URL: ${req.originalUrl}`);
    console.error('Erreur:', err.message);
    console.error('Stack:', err.stack);
    console.error('=====================\n');
    
    res.status(err.status || 500).json({ 
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Une erreur est survenue sur le serveur.' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Exporter l'application pour qu'elle puisse être utilisée par server.js
module.exports = app; 