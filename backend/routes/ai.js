const express = require('express')
const router = express.Router()
const {
  analyzeReport,
  generateDescription,
  explainMatchResult,
  getInsights,
  chat
} = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

router.post('/analyze-report', protect, analyzeReport)
router.post('/generate-description', protect, generateDescription)
router.post('/explain-match', protect, explainMatchResult)
router.get('/insights', protect, getInsights)
router.post('/chat', protect, chat)

module.exports = router