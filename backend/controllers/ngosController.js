const NGO = require('../models/NGO');

// Get all NGOs
const getNGOs = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;

    const ngos = await NGO.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single NGO
const getNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create NGO
const createNGO = async (req, res) => {
  try {
    const ngo = await NGO.create(req.body);
    res.status(201).json({ success: true, data: ngo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update NGO
const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete NGO
const deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    res.json({ success: true, message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNGOs,
  getNGO,
  createNGO,
  updateNGO,
  deleteNGO
};