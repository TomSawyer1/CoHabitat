const express = require('express');
const { registerGuardian, registerLocataire, login, getLocataireInfo } = require('../controllers/authController');

const router = express.Router();

router.post('/register/guardian', registerGuardian);
router.post('/register/locataire', registerLocataire);
router.post('/login', login);
router.get('/locataire/:id', getLocataireInfo);

module.exports = router; 