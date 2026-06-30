const { Farm, RiskAssessment, User, Animal } = require('../models');
const { calculateRiskScore, updateFarmRiskScore } = require('../services/riskEngine');

// @desc    Get risk score for a farm
// @route   GET /api/risk/farm/:farmId
// @access  Private
exports.getFarmRisk = async (req, res, next) => {
  try {
    const farm = await Farm.findByPk(req.params.farmId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: RiskAssessment, as: 'riskAssessments', limit: 10, order: [['assessment_date', 'DESC']] },
      ],
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Calculate current risk
    const currentRisk = await calculateRiskScore(farm.id);

    res.json({
      farm: {
        id: farm.id,
        name: farm.name,
        risk_score: farm.risk_score,
        risk_level: farm.risk_level,
      },
      current_risk: currentRisk,
      history: farm.riskAssessments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farms risk summary
// @route   GET /api/risk/summary
// @access  Private (admin, vet)
exports.getRiskSummary = async (req, res, next) => {
  try {
    const farms = await Farm.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { model: Animal, as: 'animals', attributes: ['id'] },
      ],
      order: [['risk_score', 'DESC']],
    });

    const summary = {
      total: farms.length,
      red: farms.filter((f) => f.risk_level === 'red').length,
      yellow: farms.filter((f) => f.risk_level === 'yellow').length,
      green: farms.filter((f) => f.risk_level === 'green').length,
      farms: farms.map((f) => ({
        id: f.id,
        name: f.name,
        owner: f.owner,
        animal_count: f.animals.length,
        risk_score: f.risk_score,
        risk_level: f.risk_level,
      })),
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

// @desc    Manually trigger risk recalculation for a farm
// @route   POST /api/risk/farm/:farmId/recalculate
// @access  Private (admin)
exports.recalculateRisk = async (req, res, next) => {
  try {
    const farm = await Farm.findByPk(req.params.farmId);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const result = await updateFarmRiskScore(farm.id);

    res.json({
      message: 'Risk score recalculated',
      assessment: result.assessment,
      escalated: result.escalated,
    });
  } catch (error) {
    next(error);
  }
};
