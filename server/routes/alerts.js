const express = require('express');
const router = express.Router();
const { getAlerts, getUnreadCount, markAsRead, resolveAlert, markAllAsRead } = require('../controllers/alertController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', protect, getAlerts);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/resolve', protect, authorize('admin'), resolveAlert);

module.exports = router;
