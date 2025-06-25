const express = require('express');
const { createIncident, getAllIncidents, getIncidentsByUserId } = require('../controllers/incidentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Route protégée pour signaler un incident
router.post('/incidents', auth, createIncident);

// Route protégée pour lister les incidents
router.get('/incidents', auth, getAllIncidents);

// Route protégée pour lister les incidents d'un utilisateur
router.get('/incidents/user/:userId', auth, getIncidentsByUserId);

module.exports = router; 