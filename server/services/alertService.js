const { Alert, Farm, User } = require('../models');
const { sendAlertNotification } = require('./notificationService');

/**
 * Create an alert and send WhatsApp + SMS notification
 * @param {Object} params - Alert parameters
 * @returns {Object} - Created alert
 */
async function createAlert({ farm_id, user_id, type, severity, message, related_amu_log_id }) {
  const alert = await Alert.create({
    farm_id,
    user_id,
    type,
    severity,
    message,
    related_amu_log_id,
  });

  // Send WhatsApp + SMS notification to the user (fire-and-forget)
  try {
    const user = await User.findByPk(user_id);
    if (user && user.phone) {
      sendAlertNotification(user.phone, { type, severity, message }).catch(err =>
        console.error('[NOTIFY] Background notification error:', err.message)
      );
    }
  } catch (err) {
    console.error('[NOTIFY] Failed to lookup user for notification:', err.message);
  }

  return alert;
}

/**
 * Create MRL violation alert
 */
async function createMRLAlert(farmId, userId, drugName, animalTag, amuLogId) {
  return createAlert({
    farm_id: farmId,
    user_id: userId,
    type: 'mrl_violation',
    severity: 'critical',
    message: `MRL violation detected for ${drugName} on animal ${animalTag}. Immediate action required.`,
    related_amu_log_id: amuLogId,
  });
}

/**
 * Create overdose alert
 */
async function createOverdoseAlert(farmId, userId, drugName, animalTag, amuLogId) {
  return createAlert({
    farm_id: farmId,
    user_id: userId,
    type: 'overdose',
    severity: 'high',
    message: `Overdose detected for ${drugName} on animal ${animalTag}. Review dosage and monitor animal.`,
    related_amu_log_id: amuLogId,
  });
}

/**
 * Create critical antibiotic alert
 */
async function createCriticalAntibioticAlert(farmId, userId, drugName, animalTag, amuLogId) {
  return createAlert({
    farm_id: farmId,
    user_id: userId,
    type: 'critical_antibiotic',
    severity: 'medium',
    message: `Critical antibiotic ${drugName} used on animal ${animalTag}. WHO Watch/Reserve category drug.`,
    related_amu_log_id: amuLogId,
  });
}

/**
 * Create risk escalation alert (Yellow to Red)
 */
async function createRiskEscalationAlert(farmId, userId, farmName, newScore) {
  return createAlert({
    farm_id: farmId,
    user_id: userId,
    type: 'risk_escalation',
    severity: 'critical',
    message: `Farm "${farmName}" risk level escalated to RED (score: ${newScore}). Immediate review required.`,
  });
}

/**
 * Get unread alerts for a user
 */
async function getUnreadAlerts(userId) {
  return Alert.findAll({
    where: {
      user_id: userId,
      is_read: false,
    },
    include: [{ model: Farm, as: 'farm', attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Mark alert as read
 */
async function markAsRead(alertId, userId) {
  const alert = await Alert.findOne({
    where: { id: alertId, user_id: userId },
  });

  if (!alert) return null;

  alert.is_read = true;
  await alert.save();
  return alert;
}

/**
 * Resolve an alert (admin only)
 */
async function resolveAlert(alertId, resolvedBy) {
  const alert = await Alert.findByPk(alertId);
  if (!alert) return null;

  alert.is_resolved = true;
  alert.resolved_by = resolvedBy;
  alert.resolved_at = new Date();
  await alert.save();
  return alert;
}

module.exports = {
  createAlert,
  createMRLAlert,
  createOverdoseAlert,
  createCriticalAntibioticAlert,
  createRiskEscalationAlert,
  getUnreadAlerts,
  markAsRead,
  resolveAlert,
};
