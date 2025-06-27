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
    getBuildingResidents
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes d'inscription et de connexion (publiques)
router.post('/register/guardian', registerGuardian);
router.post('/register/locataire', registerLocataire);
router.post('/login', login);

// Routes protégées (nécessitent une authentification)
router.get('/locataire/:id', getLocataireInfo);
router.get('/guardian/:id', getGuardianInfo);

// Profil de l'utilisateur connecté
router.get('/profile', auth, getMyProfile);

// Mise à jour des profils
router.put('/profile/locataire', auth, updateLocataireProfile);
router.put('/profile/guardian', auth, updateGuardianProfile);

// Changement de mot de passe
router.put('/change-password', auth, changePassword);

// Liste des résidents d'un bâtiment (pour les gardiens)
router.get('/buildings/:buildingId/residents', auth, getBuildingResidents);

module.exports = router; 