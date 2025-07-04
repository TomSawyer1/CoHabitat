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

router.post('/incidents', uploadMiddleware, createIncident);
router.get('/incidents', getAllIncidents);
router.get('/incidents/user/:userId', getIncidentsByUserId);
router.get('/incidents/:id', getIncidentById);
router.put('/incidents/:id', updateIncident);

router.get('/incidents/:id/history', getIncidentHistory);
router.post('/incidents/:id/comments', addIncidentComment);
router.get('/incidents/:id/comments', getIncidentComments);

router.get('/incidents/stats', getIncidentStats);

module.exports = router; 