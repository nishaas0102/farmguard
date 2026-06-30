const express = require('express');
const router = express.Router();
const { getFarms, getFarm, createFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getFarms)
  .post(protect, authorize('farmer', 'vet', 'admin'), createFarm);

router.route('/:id')
  .get(protect, getFarm)
  .put(protect, authorize('farmer', 'vet', 'admin'), updateFarm)
  .delete(protect, authorize('farmer', 'admin'), deleteFarm);

module.exports = router;
