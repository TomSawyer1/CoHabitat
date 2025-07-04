const express = require('express');
const { 
    registerGuardian, 
    registerLocataire, 
    login, 
    getLocataireInfo,
    getGuardianInfo,
    updateLocataireProfile,
    updateGuardianProfile,
    changePassword,
    getMyProfile,
    getBuildingResidents,
    deleteMyAccount
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register/guardian', registerGuardian);
router.post('/register/locataire', registerLocataire);
router.post('/login', login);

router.get('/locataire/:id', getLocataireInfo);
router.get('/guardian/:id', getGuardianInfo);

router.get('/profile', auth, getMyProfile);
router.delete('/profile', auth, deleteMyAccount);

router.put('/profile/locataire', auth, updateLocataireProfile);
router.put('/profile/guardian', auth, updateGuardianProfile);

router.put('/change-password', auth, changePassword);

router.get('/buildings/:buildingId/residents', auth, getBuildingResidents);

module.exports = router; 