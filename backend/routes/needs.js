const express = require('express');
const router = express.Router();
const {
  getNeeds,
  getNeed,
  createNeed,
  updateNeed,
  deleteNeed,
  getDashboardStats
} = require('../controllers/needsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getNeeds);
router.get('/:id', protect, getNeed);
router.post('/', protect, createNeed);
router.put('/:id', protect, updateNeed);
router.delete('/:id', protect, deleteNeed);

module.exports = router;