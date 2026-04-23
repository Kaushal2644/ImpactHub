const Need = require('../models/Need');

// Get all needs
const getNeeds = async (req, res) => {
  try {
    const { urgency, status, category } = req.query;
    let filter = {};
    if (urgency && urgency !== 'all') filter.urgency = urgency;
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;

    const needs = await Need.find(filter)
      .populate('assignedNGO', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: needs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single need
const getNeed = async (req, res) => {
  try {
    const need = await Need.findById(req.params.id)
      .populate('assignedNGO', 'name');
    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    res.json({ success: true, data: need });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create need
const createNeed = async (req, res) => {
  try {
    const need = await Need.create(req.body);
    res.status(201).json({ success: true, data: need });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update need
const updateNeed = async (req, res) => {
  try {
    const need = await Need.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    res.json({ success: true, data: need });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete need
const deleteNeed = async (req, res) => {
  try {
    const need = await Need.findByIdAndDelete(req.params.id);
    if (!need) {
      return res.status(404).json({ success: false, message: 'Need not found' });
    }
    res.json({ success: true, message: 'Need deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalNeeds = await Need.countDocuments({ status: { $ne: 'resolved' } });
    const criticalNeeds = await Need.countDocuments({ urgency: 'critical', status: { $ne: 'resolved' } });
    const needsByCategory = await Need.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const urgencyBreakdown = await Need.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);
    const recentActivity = await Need.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('assignedNGO', 'name');

    res.json({
      success: true,
      data: {
        totalNeeds,
        criticalNeeds,
        needsByCategory,
        urgencyBreakdown,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNeeds,
  getNeed,
  createNeed,
  updateNeed,
  deleteNeed,
  getDashboardStats
};