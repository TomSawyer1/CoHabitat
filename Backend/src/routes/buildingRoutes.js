const express = require('express');
const buildingController = require('../controllers/buildingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/buildings', buildingController.getAllBuildings);

// Route protégée pour obtenir les informations d'un bâtiment
router.get('/buildings/:userId', (req, res, next) => {
    console.log('Tentative d\'accès à la route /api/buildings/:userId');
    next();
}, auth, buildingController.getBuildingInfo);

module.exports = router; 