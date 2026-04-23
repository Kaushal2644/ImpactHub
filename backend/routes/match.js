const express = require('express');
const router = express.Router();
const {
  getSmartMatches,
  assignNGO
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSmartMatches);
router.post('/assign', protect, assignNGO);

module.exports = router;