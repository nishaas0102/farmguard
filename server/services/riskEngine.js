const { Op } = require('sequelize');
const { AmuLog, Drug, RiskAssessment, Farm } = require('../models');

/**
 * Risk scoring thresholds
 */
const THRESHOLDS = {
  treatment_frequency: {
    max: 25,
    levels: [
      { max: 3, score: 5 },
      { max: 6, score: 12 },
      { max: 9, score: 18 },
      { max: Infinity, score: 25 },
    ],
  },
  overdose: {
    max: 25,
    per_instance: 8,
  },
  mrl_violation: {
    max: 30,
    per_instance: 15,
  },
  critical_antibiotic: {
    max: 20,
    per_usage: 5,
  },
};

/**
 * Calculate risk score for a farm
 * @param {number} farmId - Farm ID
 * @returns {Object} - Risk assessment with scores
 */
async function calculateRiskScore(farmId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get AMU logs for last 30 days
  const recentLogs = await AmuLog.findAll({
    where: {
      farm_id: farmId,
      treatment_start_date: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
    include: [{ model: Drug, as: 'drug' }],
  });

  // 1. Treatment frequency score
  const treatmentCount = recentLogs.length;
  let treatmentScore = 0;
  for (const level of THRESHOLDS.treatment_frequency.levels) {
    if (treatmentCount <= level.max) {
      treatmentScore = level.score;
      break;
    }
  }

  // 2. Overdose score
  const overdoseCount = recentLogs.filter((log) => log.is_overdose).length;
  const overdoseScore = Math.min(
    overdoseCount * THRESHOLDS.overdose.per_instance,
    THRESHOLDS.overdose.max
  );

  // 3. MRL violation score
  const mrlViolationCount = recentLogs.filter((log) => log.is_mrl_violation).length;
  const mrlScore = Math.min(
    mrlViolationCount * THRESHOLDS.mrl_violation.per_instance,
    THRESHOLDS.mrl_violation.max
  );

  // 4. Critical antibiotic score
  const criticalCount = recentLogs.filter(
    (log) => log.drug && log.drug.is_critical
  ).length;
  const criticalScore = Math.min(
    criticalCount * THRESHOLDS.critical_antibiotic.per_usage,
    THRESHOLDS.critical_antibiotic.max
  );

  // Calculate total
  const totalScore = treatmentScore + overdoseScore + mrlScore + criticalScore;

  // Determine level
  let level = 'green';
  if (totalScore >= 70) {
    level = 'red';
  } else if (totalScore >= 31) {
    level = 'yellow';
  }

  return {
    score: totalScore,
    level,
    treatment_frequency_score: treatmentScore,
    overdose_score: overdoseScore,
    mrl_violation_score: mrlScore,
    critical_antibiotic_score: criticalScore,
  };
}

/**
 * Update farm risk score
 * @param {number} farmId - Farm ID
 * @returns {Object} - Updated risk assessment
 */
async function updateFarmRiskScore(farmId) {
  const riskData = await calculateRiskScore(farmId);
  const today = new Date().toISOString().split('T')[0];

  // Get previous risk level for escalation check
  const farm = await Farm.findByPk(farmId);
  const previousLevel = farm.risk_level;

  // Create risk assessment record
  const assessment = await RiskAssessment.create({
    farm_id: farmId,
    score: riskData.score,
    level: riskData.level,
    treatment_frequency_score: riskData.treatment_frequency_score,
    overdose_score: riskData.overdose_score,
    mrl_violation_score: riskData.mrl_violation_score,
    critical_antibiotic_score: riskData.critical_antibiotic_score,
    assessment_date: today,
  });

  // Update farm record
  await farm.update({
    risk_score: riskData.score,
    risk_level: riskData.level,
  });

  return {
    assessment,
    previousLevel,
    newLevel: riskData.level,
    escalated: previousLevel !== 'red' && riskData.level === 'red',
  };
}

module.exports = {
  calculateRiskScore,
  updateFarmRiskScore,
  THRESHOLDS,
};
