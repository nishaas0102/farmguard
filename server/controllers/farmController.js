const { Farm, User, Animal, AmuLog } = require('../models');

// @desc    Get all farms
// @route   GET /api/farms
// @access  Private (all roles)
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(farms);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private (all roles)
exports.getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Animal, as: 'animals' },
      ],
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json(farm);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a farm
// @route   POST /api/farms
// @access  Private (farmer, vet, admin)
exports.createFarm = async (req, res, next) => {
  try {
    const { name, location, district, state, area_acres } = req.body;

    const farm = await Farm.create({
      name,
      owner_id: req.user.id,
      location,
      district,
      state,
      area_acres,
    });

    res.status(201).json(farm);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a farm
// @route   PUT /api/farms/:id
// @access  Private (owner or admin)
exports.updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByPk(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Only owner or admin can update
    if (farm.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this farm' });
    }

    const { name, location, district, state, area_acres } = req.body;

    await farm.update({
      name: name || farm.name,
      location: location !== undefined ? location : farm.location,
      district: district || farm.district,
      state: state || farm.state,
      area_acres: area_acres !== undefined ? area_acres : farm.area_acres,
    });

    res.json(farm);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a farm
// @route   DELETE /api/farms/:id
// @access  Private (owner or admin)
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByPk(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Only owner or admin can delete
    if (farm.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this farm' });
    }

    await farm.destroy();
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    next(error);
  }
};
