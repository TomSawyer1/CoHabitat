const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Pour le logging des requêtes
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes'); // Importation des routes des bâtiments

const app = express();

// Middleware pour le logging des requêtes
app.use(morgan('dev')); // Utilisez 'dev' pour un format de log concis

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

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

// Utilisation des routes d'authentification
app.use('/auth', authRoutes);
// Utilisation des routes des bâtiments
app.use('/api', buildingRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('\n=== Erreur Serveur ===');
    console.error(`URL: ${req.originalUrl}`);
    console.error('Erreur:', err.message);
    console.error('Stack:', err.stack);
    console.error('=====================\n');
    res.status(500).json({ message: 'Une erreur est survenue sur le serveur.' });
});

// Exporter l'application pour qu'elle puisse être utilisée par server.js
module.exports = app; 