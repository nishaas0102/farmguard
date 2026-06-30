const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllSchemes, getRelevantSchemes } = require('../services/govtSchemeService');

// @desc    Get all government schemes
// @route   GET /api/schemes
// @access  Private
router.get('/', protect, (req, res) => {
  const schemes = getAllSchemes();
  res.json(schemes);
});

// @desc    Get schemes relevant to a farm profile
// @route   POST /api/schemes/relevant
// @access  Private
router.post('/relevant', protect, (req, res) => {
  const farmProfile = req.body;
  const schemes = getRelevantSchemes(farmProfile);
  res.json(schemes);
});

module.exports = router;
