const express = require('express');
const router = express.Router();
const { getFarmRisk, getRiskSummary, recalculateRisk } = require('../controllers/riskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/summary', protect, getRiskSummary);
router.get('/farm/:farmId', protect, getFarmRisk);
router.post('/farm/:farmId/recalculate', protect, authorize('admin'), recalculateRisk);

module.exports = router;
