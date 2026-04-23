const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'disaster relief',
            'sanitation',
            'education',
            'food security',
            'elderly care',
            'mental health',
            'healthcare',
            'infrastructure',
            'other'
        ]
    },
    urgency: {
        type: String,
        required: true,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'partially resolved', 'resolved'],
        default: 'open'
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    peopleAffected: {
        type: Number,
        default: 0
    },
    volunteersNeeded: {
        type: Number,
        default: 0
    },
    volunteersAssigned: {
        type: Number,
        default: 0
    },
    source: {
        type: String,
        enum: [
            'field report',
            'community request',
            'ngo report',
            'government',
            'other'
        ],
        default: 'community request'
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    notes: {
        type: String,
        trim: true
    },
    assignedNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Need', needSchema);