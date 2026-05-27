const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
    getAllBuildings, 
    getBuildingInfo, 
    getBuildingDetails, 
    updateBuildingInfo 
} = require('../controllers/buildingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Liste publique pour l'inscription — limite le scraping sans bloquer l'usage normal.
const publicBuildingsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Trop de requêtes. Réessayez dans quelques minutes.',
    },
});

router.get('/buildings', publicBuildingsLimiter, getAllBuildings);

router.get('/buildings/:userId', auth, getBuildingInfo);
router.get('/buildings/:id/details', auth, getBuildingDetails);
router.put('/buildings/:id', auth, updateBuildingInfo);

module.exports = router; 