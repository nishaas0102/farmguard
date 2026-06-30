const express = require('express');
const router = express.Router();
const { getAnimals, getAnimal, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getAnimals)
  .post(protect, authorize('farmer', 'vet', 'admin'), createAnimal);

router.route('/:id')
  .get(protect, getAnimal)
  .put(protect, authorize('farmer', 'vet', 'admin'), updateAnimal)
  .delete(protect, authorize('farmer', 'admin'), deleteAnimal);

module.exports = router;
