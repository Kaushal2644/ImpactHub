const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    need: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Need',
        required: true
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    },
    matchScore: {
        type: Number,
        default: 0
    },
    efficiencyScore: {
        type: Number,
        default: 0
    },
    locationScore: {
        type: Number,
        default: 0
    },
    specializationScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    notes: {
        type: String,
        trim: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);