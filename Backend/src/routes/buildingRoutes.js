const express = require('express');
const { 
    getAllBuildings, 
    getBuildingInfo, 
    getBuildingDetails, 
    updateBuildingInfo 
} = require('../controllers/buildingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/buildings', getAllBuildings);

router.get('/buildings/:userId', auth, getBuildingInfo);
router.get('/buildings/:id/details', auth, getBuildingDetails);
router.put('/buildings/:id', auth, updateBuildingInfo);

module.exports = router; 