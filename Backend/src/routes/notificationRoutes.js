const express = require('express');
const {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationsCount,
    createNotification
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Toutes les routes des notifications nécessitent une authentification
router.use(auth);

// Obtenir les notifications de l'utilisateur connecté
router.get('/', getUserNotifications);

// Obtenir le nombre de notifications non lues
router.get('/unread-count', getUnreadNotificationsCount);

// Marquer une notification comme lue
router.patch('/:id/read', markNotificationAsRead);

// Marquer toutes les notifications comme lues
router.patch('/mark-all-read', markAllNotificationsAsRead);

// Supprimer une notification
router.delete('/:id', deleteNotification);

// Créer une notification (pour les admins ou usage interne)
router.post('/', createNotification);

module.exports = router; 