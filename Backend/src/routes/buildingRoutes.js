const express = require('express');
const buildingController = require('../controllers/buildingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/buildings', buildingController.getAllBuildings);

// Route protégée pour obtenir les informations d'un bâtiment
router.get('/buildings/:userId', auth, buildingController.getBuildingInfo);

module.exports = router; 