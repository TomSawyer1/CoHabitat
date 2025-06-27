const express = require('express');
const { 
    getAllBuildings, 
    getBuildingInfo, 
    getBuildingDetails, 
    updateBuildingInfo 
} = require('../controllers/buildingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Route publique pour obtenir la liste des bâtiments (pour l'inscription)
router.get('/buildings', getAllBuildings);

// Routes protégées pour les informations des bâtiments
router.get('/buildings/:userId', auth, getBuildingInfo);          // Infos de base pour un utilisateur
router.get('/buildings/:id/details', auth, getBuildingDetails);   // Détails complets (gardiens)
router.put('/buildings/:id', auth, updateBuildingInfo);           // Mise à jour (gardiens)

module.exports = router; 