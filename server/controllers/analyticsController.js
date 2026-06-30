const { Op, fn, col, literal } = require('sequelize');
const { AmuLog, Drug, Animal, Farm, User, RiskAssessment } = require('../models');

// @desc    Dashboard summary stats
// @route   GET /api/analytics/summary
// @access  Private (admin)
exports.getSummary = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalFarms, totalAnimals, totalLogs, redFarms, yellowFarms, greenFarms] = await Promise.all([
      Farm.count(),
      Animal.count(),
      AmuLog.count({ where: { treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } } }),
      Farm.count({ where: { risk_level: 'red' } }),
      Farm.count({ where: { risk_level: 'yellow' } }),
      Farm.count({ where: { risk_level: 'green' } }),
    ]);

    const overdoseCount = await AmuLog.count({
      where: { is_overdose: true, treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
    });

    const mrlViolationCount = await AmuLog.count({
      where: { is_mrl_violation: true, treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
    });

    res.json({
      period_days: days,
      total_farms: totalFarms,
      total_animals: totalAnimals,
      total_amu_logs: totalLogs,
      overdose_count: overdoseCount,
      mrl_violation_count: mrlViolationCount,
      risk_distribution: { red: redFarms, yellow: yellowFarms, green: greenFarms },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Drug usage breakdown (top drugs by usage count)
// @route   GET /api/analytics/drug-usage
// @access  Private (admin)
exports.getDrugUsage = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const usage = await AmuLog.findAll({
      where: { treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
      attributes: [
        'drug_id',
        [fn('COUNT', col('AmuLog.id')), 'usage_count'],
      ],
      include: [{ model: Drug, as: 'drug', attributes: ['name', 'drug_class', 'who_category', 'is_critical'] }],
      group: ['drug_id', 'drug.id'],
      order: [[literal('usage_count'), 'DESC']],
      limit: 15,
    });

    res.json(usage);
  } catch (error) {
    next(error);
  }
};

// @desc    AMU trend (treatments per week over time)
// @route   GET /api/analytics/amu-trend
// @access  Private (admin)
exports.getAmuTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const trend = await AmuLog.findAll({
      where: { treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
      attributes: [
        [fn('YEARWEEK', col('treatment_start_date'), 1), 'week'],
        [fn('COUNT', col('AmuLog.id')), 'log_count'],
        [fn('SUM', literal('CASE WHEN is_overdose = true THEN 1 ELSE 0 END')), 'overdose_count'],
        [fn('SUM', literal('CASE WHEN is_mrl_violation = true THEN 1 ELSE 0 END')), 'mrl_count'],
      ],
      group: [fn('YEARWEEK', col('treatment_start_date'), 1)],
      order: [[fn('YEARWEEK', col('treatment_start_date'), 1), 'ASC']],
    });

    res.json(trend);
  } catch (error) {
    next(error);
  }
};

// @desc    Species-wise treatment breakdown
// @route   GET /api/analytics/species-breakdown
// @access  Private (admin)
exports.getSpeciesBreakdown = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const breakdown = await AmuLog.findAll({
      where: { treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
      attributes: [
        [col('animal.species'), 'species'],
        [fn('COUNT', col('AmuLog.id')), 'log_count'],
      ],
      include: [{ model: Animal, as: 'animal', attributes: [] }],
      group: ['animal.species'],
      order: [[literal('log_count'), 'DESC']],
    });

    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};

// @desc    Risk history for a farm
// @route   GET /api/analytics/risk-history/:farmId
// @access  Private
exports.getRiskHistory = async (req, res, next) => {
  try {
    const history = await RiskAssessment.findAll({
      where: { farm_id: req.params.farmId },
      order: [['assessment_date', 'ASC']],
      limit: 30,
    });

    res.json(history);
  } catch (error) {
    next(error);
  }
};

// @desc    WHO category usage breakdown
// @route   GET /api/analytics/who-categories
// @access  Private (admin)
exports.getWhoCategories = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const breakdown = await AmuLog.findAll({
      where: { treatment_start_date: { [Op.gte]: since.toISOString().split('T')[0] } },
      attributes: [
        [col('drug.who_category'), 'category'],
        [fn('COUNT', col('AmuLog.id')), 'usage_count'],
      ],
      include: [{ model: Drug, as: 'drug', attributes: [] }],
      group: ['drug.who_category'],
      order: [[literal('usage_count'), 'DESC']],
    });

    res.json(breakdown);
  } catch (error) {
    next(error);
  }
};
