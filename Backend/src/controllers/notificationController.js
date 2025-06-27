const db = require('../db/database');
const { z } = require('zod');

// Schéma de validation pour créer une notification
const notificationSchema = z.object({
    user_id: z.number().int(),
    user_role: z.enum(['locataire', 'guardian']),
    title: z.string().min(1),
    message: z.string().min(1),
    type: z.enum(['info', 'warning', 'success', 'error']).optional(),
    related_incident_id: z.number().int().optional()
});

// Obtenir toutes les notifications d'un utilisateur
const getUserNotifications = (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { unread_only } = req.query;

        let query = `
            SELECT n.*, 
                   i.type as incident_type,
                   i.description as incident_description
            FROM notifications n
            LEFT JOIN incidents i ON n.related_incident_id = i.id
            WHERE n.user_id = ? AND n.user_role = ?
        `;

        const params = [userId, userRole];

        if (unread_only === 'true') {
            query += ' AND n.is_read = FALSE';
        }

        query += ' ORDER BY n.created_at DESC';

        db.all(query, params, (err, notifications) => {
            if (err) {
                console.error('Erreur lors de la récupération des notifications:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la récupération des notifications' 
                });
            }

            res.json({ 
                success: true, 
                notifications 
            });
        });
    } catch (error) {
        console.error('Erreur dans getUserNotifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

// Marquer une notification comme lue
const markNotificationAsRead = (req, res) => {
    try {
        const notificationId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const userRole = req.user.role;

        if (isNaN(notificationId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID notification invalide' 
            });
        }

        // Vérifier que la notification appartient bien à l'utilisateur
        const query = `
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE id = ? AND user_id = ? AND user_role = ?
        `;

        db.run(query, [notificationId, userId, userRole], function(err) {
            if (err) {
                console.error('Erreur lors de la mise à jour de la notification:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la mise à jour' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Notification non trouvée ou non autorisée' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Notification marquée comme lue' 
            });
        });
    } catch (error) {
        console.error('Erreur dans markNotificationAsRead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

// Marquer toutes les notifications comme lues
const markAllNotificationsAsRead = (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const query = `
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE user_id = ? AND user_role = ? AND is_read = FALSE
        `;

        db.run(query, [userId, userRole], function(err) {
            if (err) {
                console.error('Erreur lors de la mise à jour des notifications:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la mise à jour' 
                });
            }

            res.json({ 
                success: true, 
                message: `${this.changes} notification(s) marquée(s) comme lue(s)`,
                updated_count: this.changes
            });
        });
    } catch (error) {
        console.error('Erreur dans markAllNotificationsAsRead:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

// Supprimer une notification
const deleteNotification = (req, res) => {
    try {
        const notificationId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const userRole = req.user.role;

        if (isNaN(notificationId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID notification invalide' 
            });
        }

        // Vérifier que la notification appartient bien à l'utilisateur
        const query = `
            DELETE FROM notifications 
            WHERE id = ? AND user_id = ? AND user_role = ?
        `;

        db.run(query, [notificationId, userId, userRole], function(err) {
            if (err) {
                console.error('Erreur lors de la suppression de la notification:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la suppression' 
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Notification non trouvée ou non autorisée' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Notification supprimée avec succès' 
            });
        });
    } catch (error) {
        console.error('Erreur dans deleteNotification:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

// Obtenir le nombre de notifications non lues
const getUnreadNotificationsCount = (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const query = `
            SELECT COUNT(*) as unread_count 
            FROM notifications 
            WHERE user_id = ? AND user_role = ? AND is_read = FALSE
        `;

        db.get(query, [userId, userRole], (err, result) => {
            if (err) {
                console.error('Erreur lors du comptage des notifications:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors du comptage' 
                });
            }

            res.json({ 
                success: true, 
                unread_count: result.unread_count 
            });
        });
    } catch (error) {
        console.error('Erreur dans getUnreadNotificationsCount:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

// Créer une notification (fonction utilitaire pour l'API)
const createNotification = async (req, res) => {
    try {
        const parseResult = notificationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ 
                success: false,
                message: 'Données invalides', 
                errors: parseResult.error.errors 
            });
        }

        const { user_id, user_role, title, message, type = 'info', related_incident_id } = parseResult.data;

        const query = `
            INSERT INTO notifications (user_id, user_role, title, message, type, related_incident_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(query, [user_id, user_role, title, message, type, related_incident_id], function(err) {
            if (err) {
                console.error('Erreur lors de la création de la notification:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erreur lors de la création de la notification' 
                });
            }

            res.status(201).json({ 
                success: true, 
                message: 'Notification créée avec succès',
                notificationId: this.lastID 
            });
        });
    } catch (error) {
        console.error('Erreur dans createNotification:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur' 
        });
    }
};

module.exports = {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationsCount,
    createNotification
}; 