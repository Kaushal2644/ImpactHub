const Need = require('../models/Need');
const NGO = require('../models/NGO');
const Assignment = require('../models/Assignment');

// Smart Match Algorithm
const calculateMatchScore = (ngo, need) => {
  let efficiencyScore = 0;
  let locationScore = 0;
  let specializationScore = 0;

  // Efficiency Score (40 points max)
  efficiencyScore = Math.round((ngo.efficiencyScore / 100) * 40);

  // Location Score (35 points max)
  if (ngo.operatingLocation.toLowerCase() === need.location.toLowerCase()) {
    locationScore = 35;
  } else if (ngo.serviceRadius === 'regional') {
    locationScore = 25;
  } else if (ngo.serviceRadius === 'district') {
    locationScore = 15;
  } else {
    locationScore = 5;
  }

  // Specialization Score (25 points max)
  const categoryKeywords = {
    'disaster relief': ['disaster', 'emergency', 'relief', 'flood', 'rescue'],
    'sanitation': ['sanitation', 'water', 'hygiene', 'testing', 'infrastructure'],
    'education': ['education', 'tutoring', 'teaching', 'child care', 'learning'],
    'food security': ['food', 'distribution', 'logistics', 'driving', 'security'],
    'elderly care': ['elderly', 'care', 'companionship', 'healthcare', 'first aid'],
    'mental health': ['mental health', 'counseling', 'listening', 'outreach'],
    'healthcare': ['medical', 'healthcare', 'nursing', 'first aid'],
    'infrastructure': ['construction', 'infrastructure', 'heavy machinery', 'logistics'],
    'other': []
  };

  const keywords = categoryKeywords[need.category] || [];
  const ngoSpecLower = ngo.specializations.map(s => s.toLowerCase());
  let matchedKeywords = 0;

  keywords.forEach(keyword => {
    if (ngoSpecLower.some(spec => spec.includes(keyword))) {
      matchedKeywords++;
    }
  });

  if (keywords.length > 0) {
    specializationScore = Math.round((matchedKeywords / keywords.length) * 25);
  }

  const totalScore = efficiencyScore + locationScore + specializationScore;

  return {
    totalScore: Math.min(totalScore, 100),
    efficiencyScore,
    locationScore,
    specializationScore
  };
};

// Get smart matches
const getSmartMatches = async (req, res) => {
  try {
    const { urgency } = req.query;

    let needFilter = { status: { $in: ['open', 'in progress'] } };
    if (urgency && urgency !== 'all') needFilter.urgency = urgency;

    const needs = await Need.find(needFilter);
    const ngos = await NGO.find({ status: 'active' });

    const matches = [];

    needs.forEach(need => {
      ngos.forEach(ngo => {
        // Skip if NGO is at full capacity
        if (ngo.currentAssignments >= ngo.assignmentCapacity) return;

        const scores = calculateMatchScore(ngo, need);

        matches.push({
          need,
          ngo,
          matchScore: scores.totalScore,
          efficiencyScore: scores.efficiencyScore,
          locationScore: scores.locationScore,
          specializationScore: scores.specializationScore
        });
      });
    });

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Get top matches (remove duplicates — best match per need)
    const seen = new Set();
    const topMatches = matches.filter(m => {
      const key = m.need._id.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.json({
      success: true,
      data: {
        matches: topMatches,
        totalNeeds: needs.length,
        totalNGOs: ngos.length,
        totalMatches: topMatches.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign NGO to Need
const assignNGO = async (req, res) => {
  try {
    const { needId, ngoId, matchScore, efficiencyScore, locationScore, specializationScore } = req.body;

    const need = await Need.findById(needId);
    const ngo = await NGO.findById(ngoId);

    if (!need || !ngo) {
      return res.status(404).json({ success: false, message: 'Need or NGO not found' });
    }

    // Create assignment
    const assignment = await Assignment.create({
      need: needId,
      ngo: ngoId,
      matchScore,
      efficiencyScore,
      locationScore,
      specializationScore
    });

    // Update need status and assigned NGO
    need.status = 'in progress';
    need.assignedNGO = ngoId;
    need.volunteersAssigned += 1;
    await need.save();

    // Update NGO current assignments
    ngo.currentAssignments += 1;
    if (ngo.currentAssignments >= ngo.assignmentCapacity) {
      ngo.status = 'assigned';
    }
    await ngo.save();

    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSmartMatches,
  assignNGO
};