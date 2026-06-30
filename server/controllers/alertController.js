const { Alert, Farm, User, AmuLog } = require('../models');
const alertService = require('../services/alertService');

// @desc    Get alerts for current user
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
  try {
    const { farm_id, is_read, is_resolved, type } = req.query;

    const where = {};

    // Admin sees all alerts, others see their own
    if (req.user.role !== 'admin') {
      where.user_id = req.user.id;
    }

    if (farm_id) where.farm_id = farm_id;
    if (is_read !== undefined) where.is_read = is_read === 'true';
    if (is_resolved !== undefined) where.is_resolved = is_resolved === 'true';
    if (type) where.type = type;

    const alerts = await Alert.findAll({
      where,
      include: [
        { model: Farm, as: 'farm', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'resolvedBy', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread alert count
// @route   GET /api/alerts/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const where = { is_read: false };

    if (req.user.role !== 'admin') {
      where.user_id = req.user.id;
    }

    const count = await Alert.count({ where });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const alert = await alertService.markAsRead(req.params.id, req.user.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve an alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private (admin only)
exports.resolveAlert = async (req, res, next) => {
  try {
    const alert = await alertService.resolveAlert(req.params.id, req.user.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all alerts as read
// @route   PUT /api/alerts/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const where = { is_read: false };

    if (req.user.role !== 'admin') {
      where.user_id = req.user.id;
    }

    await Alert.update({ is_read: true }, { where });

    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    next(error);
  }
};
