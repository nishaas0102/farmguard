const express = require('express');
const router = express.Router();
const {
  getSummary,
  getDrugUsage,
  getAmuTrend,
  getSpeciesBreakdown,
  getRiskHistory,
  getWhoCategories,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/summary', protect, authorize('admin'), getSummary);
router.get('/drug-usage', protect, authorize('admin'), getDrugUsage);
router.get('/amu-trend', protect, authorize('admin'), getAmuTrend);
router.get('/species-breakdown', protect, authorize('admin'), getSpeciesBreakdown);
router.get('/risk-history/:farmId', protect, getRiskHistory);
router.get('/who-categories', protect, authorize('admin'), getWhoCategories);

module.exports = router;
