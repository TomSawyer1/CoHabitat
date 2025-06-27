const express = require('express');
const { 
    createIncident, 
    getAllIncidents, 
    getIncidentsByUserId,
    getIncidentById,
    updateIncident,
    getIncidentHistory,
    addIncidentComment,
    getIncidentComments,
    getIncidentStats
} = require('../controllers/incidentController');
const auth = require('../middleware/auth');
const { uploadMiddleware } = require('../middleware/upload');

const router = express.Router();

// Toutes les routes des incidents nécessitent une authentification
router.use(auth);

// Routes pour les incidents
router.post('/incidents', uploadMiddleware, createIncident);                    // Créer un incident avec image
router.get('/incidents', getAllIncidents);                   // Lister tous les incidents (avec filtres)
router.get('/incidents/user/:userId', getIncidentsByUserId); // Incidents d'un utilisateur
router.get('/incidents/:id', getIncidentById);               // Obtenir un incident par ID
router.put('/incidents/:id', updateIncident);                // Mettre à jour un incident (gardiens)

// Routes pour l'historique et les commentaires
router.get('/incidents/:id/history', getIncidentHistory);    // Historique d'un incident
router.post('/incidents/:id/comments', addIncidentComment);  // Ajouter un commentaire
router.get('/incidents/:id/comments', getIncidentComments);  // Obtenir les commentaires

// Statistiques pour les gardiens
router.get('/incidents/stats', getIncidentStats);            // Statistiques des incidents

module.exports = router; 