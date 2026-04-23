const express = require('express');
const router = express.Router();
const {
  getNGOs,
  getNGO,
  createNGO,
  updateNGO,
  deleteNGO
} = require('../controllers/ngosController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNGOs);
router.get('/:id', protect, getNGO);
router.post('/', protect, createNGO);
router.put('/:id', protect, updateNGO);
router.delete('/:id', protect, deleteNGO);

module.exports = router;