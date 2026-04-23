const FieldReport = require('../models/FieldReport');
const Need = require('../models/Need');

// Get all reports
const getReports = async (req, res) => {
  try {
    const reports = await FieldReport.find()
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create report
const createReport = async (req, res) => {
  try {
    const report = await FieldReport.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await FieldReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Convert report to community need
const convertToNeed = async (req, res) => {
  try {
    const report = await FieldReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    if (report.isConverted) {
      return res.status(400).json({ success: false, message: 'Report already converted' });
    }

    // Create need from report
    const need = await Need.create({
      title: report.title,
      description: report.summary,
      category: report.category,
      urgency: report.urgencyObserved,
      location: report.location,
      peopleAffected: report.peopleAffected,
      source: 'field report',
      status: 'open'
    });

    // Mark report as converted
    report.isConverted = true;
    report.convertedNeedId = need._id;
    await report.save();

    res.json({ success: true, data: { report, need } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReports,
  createReport,
  deleteReport,
  convertToNeed
};