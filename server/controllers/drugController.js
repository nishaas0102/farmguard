const { Drug } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all drugs (public)
// @route   GET /api/drugs
// @access  Public
exports.getDrugs = async (req, res, next) => {
  try {
    const { search, who_category, is_critical } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { generic_name: { [Op.like]: `%${search}%` } },
      ];
    }
    if (who_category) {
      where.who_category = who_category;
    }
    if (is_critical !== undefined) {
      where.is_critical = is_critical === 'true';
    }

    const drugs = await Drug.findAll({
      where,
      order: [['name', 'ASC']],
    });

    res.json(drugs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drug
// @route   GET /api/drugs/:id
// @access  Public
exports.getDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByPk(req.params.id);

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json(drug);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a drug
// @route   POST /api/drugs
// @access  Private (admin only)
exports.createDrug = async (req, res, next) => {
  try {
    const {
      name, generic_name, drug_class, who_category, is_critical,
      mrl_limit_mg_kg, mrl_species, withdrawal_days_meat,
      withdrawal_days_milk, withdrawal_days_egg, dosage_per_kg, unit, route,
    } = req.body;

    const drug = await Drug.create({
      name, generic_name, drug_class, who_category, is_critical,
      mrl_limit_mg_kg, mrl_species, withdrawal_days_meat,
      withdrawal_days_milk, withdrawal_days_egg, dosage_per_kg, unit, route,
    });

    res.status(201).json(drug);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a drug
// @route   PUT /api/drugs/:id
// @access  Private (admin only)
exports.updateDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByPk(req.params.id);

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    await drug.update(req.body);
    res.json(drug);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a drug
// @route   DELETE /api/drugs/:id
// @access  Private (admin only)
exports.deleteDrug = async (req, res, next) => {
  try {
    const drug = await Drug.findByPk(req.params.id);

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    await drug.destroy();
    res.json({ message: 'Drug deleted successfully' });
  } catch (error) {
    next(error);
  }
};
