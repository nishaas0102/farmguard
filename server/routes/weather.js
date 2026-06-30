const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWeatherAlerts } = require('../services/weatherAlertService');

// @desc    Get weather-based disease alerts
// @route   GET /api/weather/alerts?district=X&state=Y
// @access  Private
router.get('/alerts', protect, async (req, res, next) => {
  try {
    const { district, state } = req.query;
    const result = await getWeatherAlerts(district, state);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
