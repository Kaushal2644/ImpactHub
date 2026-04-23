const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Need = require('./models/Need');
const NGO = require('./models/NGO');
const FieldReport = require('./models/FieldReport');

mongoose.connect(process.env.MONGODB_URI);

const users = [
  {
    name: 'Admin User',
    email: 'admin@impacthub.com',
    password: 'admin123',
    role: 'admin',
    authProvider: 'local'
  },
  {
    name: 'John Volunteer',
    email: 'volunteer@impacthub.com',
    password: 'volunteer123',
    role: 'volunteer',
    authProvider: 'local'
  }
];

const ngos = [
  {
    name: 'WaterSafe Initiative',
    contactEmail: 'field@watersafe.org',
    phone: '+1-555-1005',
    primaryContact: 'Mei Lin Wong',
    operatingLocation: 'Riverside District',
    serviceRadius: 'district',
    assignmentCapacity: 5,
    currentAssignments: 0,
    efficiencyScore: 90,
    specializations: ['Sanitation', 'Water Testing', 'Infrastructure', 'Logistics'],
    status: 'active'
  },
  {
    name: 'MindBridge Counseling',
    contactEmail: 'contact@mindbridge.org',
    phone: '+1-555-1002',
    primaryContact: 'Dr. Sarah Chen',
    operatingLocation: 'Valley Creek',
    serviceRadius: 'district',
    assignmentCapacity: 4,
    currentAssignments: 0,
    efficiencyScore: 87,
    specializations: ['Mental Health', 'Counseling', 'Active Listening', 'Community Outreach'],
    status: 'active'
  },
  {
    name: 'BuildUp Corps',
    contactEmail: 'info@buildupcorps.org',
    phone: '+1-555-1003',
    primaryContact: 'Raj Sharma',
    operatingLocation: 'Sunflower Estates',
    serviceRadius: 'regional',
    assignmentCapacity: 7,
    currentAssignments: 1,
    efficiencyScore: 78,
    specializations: ['Construction', 'Infrastructure', 'Heavy Machinery', 'Logistics'],
    status: 'active'
  },
  {
    name: 'ChildFirst NGO',
    contactEmail: 'help@childfirst.org',
    phone: '+1-555-1004',
    primaryContact: 'Elena Vasquez',
    operatingLocation: 'Sunflower Estates',
    serviceRadius: 'district',
    assignmentCapacity: 6,
    currentAssignments: 0,
    efficiencyScore: 83,
    specializations: ['Child Welfare', 'Healthcare', 'Nursing', 'Community Outreach'],
    status: 'active'
  },
  {
    name: 'MedAid Relief',
    contactEmail: 'respond@medaid.org',
    phone: '+1-555-1006',
    primaryContact: 'Dr. Fatima Al-Hassan',
    operatingLocation: 'Riverside District',
    serviceRadius: 'regional',
    assignmentCapacity: 8,
    currentAssignments: 2,
    efficiencyScore: 92,
    specializations: ['Medical', 'Healthcare', 'First Aid', 'Mental Health'],
    status: 'active'
  },
  {
    name: 'EduBridge Foundation',
    contactEmail: 'learn@edubridge.org',
    phone: '+1-555-1007',
    primaryContact: 'James Okello',
    operatingLocation: 'Oakwood Heights',
    serviceRadius: 'district',
    assignmentCapacity: 10,
    currentAssignments: 3,
    efficiencyScore: 88,
    specializations: ['Education', 'Tutoring', 'Child Care', 'Community Outreach'],
    status: 'active'
  },
  {
    name: 'FoodFirst Network',
    contactEmail: 'feed@foodfirst.org',
    phone: '+1-555-1008',
    primaryContact: 'Maria Santos',
    operatingLocation: 'Valley Creek',
    serviceRadius: 'regional',
    assignmentCapacity: 12,
    currentAssignments: 5,
    efficiencyScore: 95,
    specializations: ['Food Security', 'Logistics', 'Driving', 'Distribution'],
    status: 'active'
  },
  {
    name: 'ElderCare Alliance',
    contactEmail: 'care@eldercare.org',
    phone: '+1-555-1009',
    primaryContact: 'David Kofi',
    operatingLocation: 'Pine Gardens',
    serviceRadius: 'local',
    assignmentCapacity: 6,
    currentAssignments: 1,
    efficiencyScore: 85,
    specializations: ['Elderly Care', 'Companionship', 'Healthcare', 'First Aid'],
    status: 'active'
  }
];

const needs = [
  {
    title: 'Valley Creek Post-Flood Observation',
    description: 'Severe flooding damage observed. Main road partially destroyed. Several homes damaged. Residents showing signs of trauma. Food supplies running low in affected areas.',
    category: 'disaster relief',
    urgency: 'critical',
    status: 'open',
    location: 'Valley Creek',
    peopleAffected: 800,
    volunteersNeeded: 10,
    volunteersAssigned: 0,
    source: 'field report'
  },
  {
    title: 'Clean Water Access in Riverside District',
    description: 'Several families in the Riverside area report contaminated well water. Need immediate water purification support and alternative water supply.',
    category: 'sanitation',
    urgency: 'critical',
    status: 'in progress',
    location: 'Riverside District',
    peopleAffected: 350,
    volunteersNeeded: 8,
    volunteersAssigned: 3,
    source: 'community request'
  },
  {
    title: 'After-School Tutoring Program',
    description: 'Local school reports 40% of students falling behind in math and reading. Volunteer tutors needed for 3-month intervention program.',
    category: 'education',
    urgency: 'high',
    status: 'in progress',
    location: 'Oakwood Heights',
    peopleAffected: 120,
    volunteersNeeded: 12,
    volunteersAssigned: 5,
    source: 'ngo report'
  },
  {
    title: 'Emergency Food Distribution',
    description: 'Post-flood food shortage affecting families in low-lying areas. Weekly food bank distribution needed.',
    category: 'food security',
    urgency: 'critical',
    status: 'in progress',
    location: 'Valley Creek',
    peopleAffected: 500,
    volunteersNeeded: 15,
    volunteersAssigned: 7,
    source: 'field report'
  },
  {
    title: 'Senior Home Visit Program',
    description: 'Isolated elderly residents need regular check-ins and basic assistance with daily activities.',
    category: 'elderly care',
    urgency: 'medium',
    status: 'open',
    location: 'Pine Gardens',
    peopleAffected: 45,
    volunteersNeeded: 6,
    volunteersAssigned: 1,
    source: 'community request'
  },
  {
    title: 'Mental Health Support Groups',
    description: 'Post-disaster trauma support needed. Community members showing signs of anxiety and depression.',
    category: 'mental health',
    urgency: 'high',
    status: 'open',
    location: 'Valley Creek',
    peopleAffected: 200,
    volunteersNeeded: 4,
    volunteersAssigned: 0,
    source: 'ngo report'
  },
  {
    title: 'Road Repair After Flooding',
    description: 'Main access road to Valley Creek severely damaged. Temporary repair needed for emergency vehicle access.',
    category: 'infrastructure',
    urgency: 'high',
    status: 'open',
    location: 'Valley Creek',
    peopleAffected: 800,
    volunteersNeeded: 10,
    volunteersAssigned: 0,
    source: 'field report'
  },
  {
    title: 'Child Immunization Drive',
    description: 'Routine immunization coverage dropped to 60%. Mobile clinic support needed for door-to-door campaign.',
    category: 'healthcare',
    urgency: 'medium',
    status: 'open',
    location: 'Sunflower Estates',
    peopleAffected: 300,
    volunteersNeeded: 6,
    volunteersAssigned: 0,
    source: 'government'
  }
];

const fieldReports = [
  {
    title: 'Riverside Water Quality Assessment',
    type: 'assessment',
    category: 'sanitation',
    location: 'Riverside District',
    summary: 'Water samples from 12 wells tested. 8 out of 12 showed bacterial contamination above safe levels. Residents report gastrointestinal issues. Immediate intervention required.',
    urgencyObserved: 'critical',
    peopleAffected: 350,
    isConverted: true,
    submittedBy: 'Field Agent 1'
  },
  {
    title: 'Oakwood Heights Education Survey',
    type: 'survey',
    category: 'education',
    location: 'Oakwood Heights',
    summary: 'Surveyed 85 households. 40% of school-age children are behind grade level. Primary concerns: lack of after-school support, parents working multiple jobs.',
    urgencyObserved: 'high',
    peopleAffected: 120,
    isConverted: true,
    submittedBy: 'Field Agent 2'
  },
  {
    title: 'Valley Creek Post-Flood Observation',
    type: 'observation',
    category: 'disaster relief',
    location: 'Valley Creek',
    summary: 'Severe flooding damage observed. Main road partially destroyed. Several homes damaged. Residents showing signs of trauma. Food supplies running low in affected areas.',
    urgencyObserved: 'critical',
    peopleAffected: 800,
    isConverted: true,
    submittedBy: 'Field Agent 1'
  },
  {
    title: 'Pine Gardens Senior Wellness Check',
    type: 'interview',
    category: 'elderly care',
    location: 'Pine Gardens',
    summary: 'Interviewed 20 elderly residents. Many living alone with limited mobility. 60% report difficulty accessing healthcare. Several have not had visitors in weeks.',
    urgencyObserved: 'medium',
    peopleAffected: 45,
    isConverted: true,
    submittedBy: 'Field Agent 3'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Need.deleteMany();
    await NGO.deleteMany();
    await FieldReport.deleteMany();

    console.log('Existing data cleared...');

    // Create users
    await User.create(users);
    console.log('Users seeded...');

    // Create NGOs
    await NGO.create(ngos);
    console.log('NGOs seeded...');

    // Create needs
    await Need.create(needs);
    console.log('Needs seeded...');

    // Create field reports
    await FieldReport.create(fieldReports);
    console.log('Field Reports seeded...');

    console.log('✅ All data seeded successfully!');
    console.log('');
    console.log('Test Accounts:');
    console.log('Admin  → admin@impacthub.com / admin123');
    console.log('Volunteer → volunteer@impacthub.com / volunteer123');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

importData();