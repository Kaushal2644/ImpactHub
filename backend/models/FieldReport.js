const mongoose = require('mongoose');

const fieldReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'observation',
            'survey',
            'assessment',
            'interview',
            'other'
        ],
        default: 'observation'
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
        ],
        default: 'other'
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    urgencyObserved: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
    },
    peopleAffected: {
        type: Number,
        default: 0
    },
    attachmentUrl: {
        type: String,
        default: null
    },
    isConverted: {
        type: Boolean,
        default: false
    },
    convertedNeedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Need',
        default: null
    },
    submittedBy: {
        type: String,
        trim: true,
        default: 'Anonymous'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FieldReport', fieldReportSchema);