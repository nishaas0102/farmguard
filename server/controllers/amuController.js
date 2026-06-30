const { AmuLog, Animal, Drug, Farm, User } = require('../models');
const { calculateWithdrawalDates, checkOverdose, checkMRLViolation } = require('../services/withdrawalCalculator');
const { updateFarmRiskScore } = require('../services/riskEngine');
const {
  createMRLAlert,
  createOverdoseAlert,
  createCriticalAntibioticAlert,
  createRiskEscalationAlert,
} = require('../services/alertService');

// @desc    Get AMU logs (filtered by farm or animal)
// @route   GET /api/amu?farm_id=X&animal_id=Y
// @access  Private
exports.getAmuLogs = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.farm_id) where.farm_id = req.query.farm_id;
    if (req.query.animal_id) where.animal_id = req.query.animal_id;

    const logs = await AmuLog.findAll({
      where,
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'tag_number', 'species'] },
        { model: Drug, as: 'drug', attributes: ['id', 'name', 'who_category', 'is_critical'] },
        { model: Farm, as: 'farm', attributes: ['id', 'name'] },
        { model: User, as: 'loggedBy', attributes: ['id', 'name', 'role'] },
        { model: User, as: 'vet', attributes: ['id', 'name', 'role'] },
      ],
      order: [['treatment_start_date', 'DESC']],
    });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single AMU log
// @route   GET /api/amu/:id
// @access  Private
exports.getAmuLog = async (req, res, next) => {
  try {
    const log = await AmuLog.findByPk(req.params.id, {
      include: [
        { model: Animal, as: 'animal' },
        { model: Drug, as: 'drug' },
        { model: Farm, as: 'farm' },
        { model: User, as: 'loggedBy', attributes: ['id', 'name', 'role'] },
        { model: User, as: 'vet', attributes: ['id', 'name', 'role'] },
      ],
    });

    if (!log) {
      return res.status(404).json({ message: 'AMU log not found' });
    }

    res.json(log);
  } catch (error) {
    next(error);
  }
};

// @desc    Create AMU log (log a treatment)
// @route   POST /api/amu
// @access  Private (farmer, vet, admin)
exports.createAmuLog = async (req, res, next) => {
  try {
    const {
      animal_id, drug_id, dosage, dosage_unit, frequency,
      duration_days, reason, treatment_start_date, treatment_end_date,
      vet_id, notes,
    } = req.body;

    // Verify animal exists
    const animal = await Animal.findByPk(animal_id, {
      include: [{ model: Farm, as: 'farm' }],
    });
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Verify drug exists
    const drug = await Drug.findByPk(drug_id);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Calculate withdrawal dates
    const withdrawalDates = calculateWithdrawalDates(
      drug,
      animal,
      treatment_end_date || treatment_start_date
    );

    // Check for overdose
    const isOverdose = checkOverdose(drug, dosage, animal.weight_kg);

    // Check for MRL violation
    const isMrlViolation = checkMRLViolation(drug, dosage, animal.weight_kg);

    // Create the AMU log from prescription data
    const amuLog = await AmuLog.create({
      animal_id,
      farm_id: animal.farm_id,
      drug_id,
      user_id: req.user.id,
      vet_id: vet_id || req.user.id,
      dosage,
      dosage_unit: dosage_unit || drug.unit,
      frequency,
      duration_days,
      reason,
      treatment_start_date,
      treatment_end_date: treatment_end_date || treatment_start_date,
      withdrawal_end_date_meat: withdrawalDates.withdrawal_end_date_meat,
      withdrawal_end_date_milk: withdrawalDates.withdrawal_end_date_milk,
      withdrawal_end_date_egg: withdrawalDates.withdrawal_end_date_egg,
      safe_sale_date: withdrawalDates.safe_sale_date,
      is_overdose: isOverdose,
      is_mrl_violation: isMrlViolation,
      notes,
      prescription_id: req.body.prescription_id || `PRESC-${Date.now()}`,
    });

    // Generate alerts
    const alerts = [];

    if (isMrlViolation) {
      const alert = await createMRLAlert(
        animal.farm_id,
        req.user.id,
        drug.name,
        animal.tag_number,
        amuLog.id
      );
      alerts.push(alert);
    }

    if (isOverdose) {
      const alert = await createOverdoseAlert(
        animal.farm_id,
        req.user.id,
        drug.name,
        animal.tag_number,
        amuLog.id
      );
      alerts.push(alert);
    }

    if (drug.is_critical) {
      const alert = await createCriticalAntibioticAlert(
        animal.farm_id,
        req.user.id,
        drug.name,
        animal.tag_number,
        amuLog.id
      );
      alerts.push(alert);
    }

    // Update risk score in real time
    const riskResult = await updateFarmRiskScore(animal.farm_id);

    // Check for risk escalation (Yellow to Red)
    if (riskResult.escalated) {
      const farmOwner = await User.findByPk(animal.farm.owner_id);
      if (farmOwner) {
        await createRiskEscalationAlert(
          animal.farm_id,
          farmOwner.id,
          animal.farm.name,
          riskResult.assessment.score
        );
      }
    }

    // Fetch complete log with associations
    const completeLog = await AmuLog.findByPk(amuLog.id, {
      include: [
        { model: Animal, as: 'animal' },
        { model: Drug, as: 'drug' },
        { model: Farm, as: 'farm' },
      ],
    });

    res.status(201).json({
      amu_log: completeLog,
      alerts_generated: alerts.length,
      risk_update: {
        score: riskResult.assessment.score,
        level: riskResult.assessment.level,
        escalated: riskResult.escalated,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update AMU log
// @route   PUT /api/amu/:id
// @access  Private (owner or admin)
exports.updateAmuLog = async (req, res, next) => {
  try {
    const log = await AmuLog.findByPk(req.params.id);

    if (!log) {
      return res.status(404).json({ message: 'AMU log not found' });
    }

    // Only log creator or admin can update
    if (log.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }

    await log.update(req.body);

    // Recalculate risk if relevant fields changed
    if (req.body.dosage || req.body.drug_id) {
      await updateFarmRiskScore(log.farm_id);
    }

    res.json(log);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete AMU log
// @route   DELETE /api/amu/:id
// @access  Private (owner or admin)
exports.deleteAmuLog = async (req, res, next) => {
  try {
    const log = await AmuLog.findByPk(req.params.id);

    if (!log) {
      return res.status(404).json({ message: 'AMU log not found' });
    }

    // Only log creator or admin can delete
    if (log.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this log' });
    }

    const farmId = log.farm_id;
    await log.destroy();

    // Recalculate risk after deletion
    await updateFarmRiskScore(farmId);

    res.json({ message: 'AMU log deleted successfully' });
  } catch (error) {
    next(error);
  }
};
