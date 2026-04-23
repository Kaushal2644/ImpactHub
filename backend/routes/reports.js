const express = require('express');
const router = express.Router();
const {
  getReports,
  createReport,
  deleteReport,
  convertToNeed
} = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReports);
router.post('/', protect, createReport);
router.delete('/:id', protect, deleteReport);
router.post('/:id/convert', protect, convertToNeed);

module.exports = router;