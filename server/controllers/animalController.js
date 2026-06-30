const { Animal, Farm, AmuLog, Drug } = require('../models');

// @desc    Get all animals (optionally filtered by farm)
// @route   GET /api/animals?farm_id=X
// @access  Private (all roles)
exports.getAnimals = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.farm_id) {
      where.farm_id = req.query.farm_id;
    }

    const animals = await Animal.findAll({
      where,
      include: [
        { model: Farm, as: 'farm', attributes: ['id', 'name', 'owner_id'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(animals);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single animal
// @route   GET /api/animals/:id
// @access  Private (all roles)
exports.getAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [
        { model: Farm, as: 'farm', attributes: ['id', 'name', 'owner_id'] },
        {
          model: AmuLog,
          as: 'amuLogs',
          include: [{ model: Drug, as: 'drug' }],
          order: [['treatment_start_date', 'DESC']],
        },
      ],
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.json(animal);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an animal
// @route   POST /api/animals
// @access  Private (farmer, vet, admin)
exports.createAnimal = async (req, res, next) => {
  try {
    const { farm_id, tag_number, species, breed, weight_kg, date_of_birth, gender } = req.body;

    // Verify farm exists
    const farm = await Farm.findByPk(farm_id);
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Only farm owner or admin can add animals
    if (farm.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add animals to this farm' });
    }

    const animal = await Animal.create({
      farm_id,
      tag_number,
      species,
      breed,
      weight_kg,
      date_of_birth,
      gender,
    });

    res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an animal
// @route   PUT /api/animals/:id
// @access  Private (owner or admin)
exports.updateAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [{ model: Farm, as: 'farm' }],
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Only farm owner or admin can update
    if (animal.farm.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this animal' });
    }

    const { tag_number, species, breed, weight_kg, date_of_birth, gender, status } = req.body;

    await animal.update({
      tag_number: tag_number || animal.tag_number,
      species: species || animal.species,
      breed: breed !== undefined ? breed : animal.breed,
      weight_kg: weight_kg !== undefined ? weight_kg : animal.weight_kg,
      date_of_birth: date_of_birth !== undefined ? date_of_birth : animal.date_of_birth,
      gender: gender !== undefined ? gender : animal.gender,
      status: status || animal.status,
    });

    res.json(animal);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an animal
// @route   DELETE /api/animals/:id
// @access  Private (owner or admin)
exports.deleteAnimal = async (req, res, next) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [{ model: Farm, as: 'farm' }],
    });

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Only farm owner or admin can delete
    if (animal.farm.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this animal' });
    }

    await animal.destroy();
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
