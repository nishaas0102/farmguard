const express = require('express');
const router = express.Router();
const { getAmuLogs, getAmuLog, createAmuLog, updateAmuLog, deleteAmuLog } = require('../controllers/amuController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getAmuLogs)
  .post(protect, authorize('farmer', 'vet', 'admin'), createAmuLog);

router.route('/:id')
  .get(protect, getAmuLog)
  .put(protect, authorize('farmer', 'vet', 'admin'), updateAmuLog)
  .delete(protect, authorize('farmer', 'vet', 'admin'), deleteAmuLog);

module.exports = router;
