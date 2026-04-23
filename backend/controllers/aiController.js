const {
  analyzeFieldReport,
  generateNeedDescription,
  explainMatch,
  getCommunityInsights,
  chatWithAI
} = require('../services/aiService')
const Need = require('../models/Need')
const NGO = require('../models/NGO')
const FieldReport = require('../models/FieldReport')

// Handle AI errors
const handleAIError = (error, res) => {
  console.error('AI Error:', error.message)
  if (error.message.includes('429') || error.message.includes('quota')) {
    return res.status(429).json({
      success: false,
      message: 'AI rate limit exceeded. Please try again in a moment.'
    })
  }
  if (error.message.includes('JSON')) {
    return res.status(500).json({
      success: false,
      message: 'AI response parsing error. Please try again.'
    })
  }
  res.status(500).json({
    success: false,
    message: 'AI service error. Please try again.'
  })
}

// Analyze field report
const analyzeReport = async (req, res) => {
  try {
    const result = await analyzeFieldReport(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    handleAIError(error, res)
  }
}

// Generate need description
const generateDescription = async (req, res) => {
  try {
    const result = await generateNeedDescription(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    handleAIError(error, res)
  }
}

// Explain match
const explainMatchResult = async (req, res) => {
  try {
    const { ngoId, needId } = req.body
    const ngo = await NGO.findById(ngoId)
    const need = await Need.findById(needId)
    if (!ngo || !need) {
      return res.status(404).json({
        success: false,
        message: 'NGO or Need not found'
      })
    }
    const result = await explainMatch(ngo, need)
    res.json({ success: true, data: result })
  } catch (error) {
    handleAIError(error, res)
  }
}

// Community insights
const getInsights = async (req, res) => {
  try {
    const needs = await Need.find({ status: { $ne: 'resolved' } }).limit(20)
    const ngos = await NGO.find({ status: 'active' }).limit(10)
    const reports = await FieldReport.find().sort({ createdAt: -1 }).limit(10)
    const result = await getCommunityInsights(needs, ngos, reports)
    res.json({ success: true, data: result })
  } catch (error) {
    handleAIError(error, res)
  }
}

// Chatbot
const chat = async (req, res) => {
  try {
    const { message } = req.body
    const totalNeeds = await Need.countDocuments({ status: { $ne: 'resolved' } })
    const criticalNeeds = await Need.countDocuments({
      urgency: 'critical',
      status: { $ne: 'resolved' }
    })
    const totalNGOs = await NGO.countDocuments({ status: 'active' })
    const recentNeeds = await Need.find().sort({ createdAt: -1 }).limit(5)

    const context = { totalNeeds, criticalNeeds, totalNGOs, recentNeeds }
    const response = await chatWithAI(message, context)
    res.json({ success: true, data: { response } })
  } catch (error) {
    handleAIError(error, res)
  }
}

module.exports = {
  analyzeReport,
  generateDescription,
  explainMatchResult,
  getInsights,
  chat
}