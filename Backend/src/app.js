const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Pour le logging des requêtes
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes'); // Importation des routes des bâtiments
const incidentsRoutes = require('./routes/incidentsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware pour le logging des requêtes
app.use(morgan('dev')); // Utilisez 'dev' pour un format de log concis

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS amélioré pour le développement
app.use(cors({
    origin: ['http://localhost:19006', 'http://localhost:8081', 'exp://localhost:19000'],
    credentials: true
}));

// Servir les images statiques depuis le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de logging détaillé des requêtes
app.use((req, res, next) => {
    console.log('\n=== Nouvelle requête ===');
    console.log(`Méthode: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=====================\n');
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

// Routes des notifications
app.use('/api/notifications', notificationRoutes);

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
            notifications: '/api/notifications',
            uploads: '/uploads/*'
        },
        status: 'Production Ready'
    });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
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
            'GET /api/notifications',
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