const express = require('express');
const router = express.Router();
const { getDrugs, getDrug, createDrug, updateDrug, deleteDrug } = require('../controllers/drugController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { checkInteractions, checkNewDrug } = require('../services/drugInteractionService');

// Drug interaction check routes
router.post('/check-interactions', protect, (req, res) => {
  const { drugNames } = req.body;
  if (!drugNames || !Array.isArray(drugNames)) {
    return res.status(400).json({ message: 'drugNames array is required' });
  }
  const interactions = checkInteractions(drugNames);
  res.json({ interactions });
});

router.post('/check-new', protect, (req, res) => {
  const { existingDrugs, newDrug } = req.body;
  if (!existingDrugs || !newDrug) {
    return res.status(400).json({ message: 'existingDrugs array and newDrug string are required' });
  }
  const interactions = checkNewDrug(existingDrugs, newDrug);
  res.json({ interactions });
});

// Public routes
router.get('/', getDrugs);
router.get('/:id', getDrug);

// Admin only routes
router.post('/', protect, authorize('admin'), createDrug);
router.put('/:id', protect, authorize('admin'), updateDrug);
router.delete('/:id', protect, authorize('admin'), deleteDrug);

module.exports = router;
