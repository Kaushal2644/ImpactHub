const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    contactEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    primaryContact: {
        type: String,
        trim: true
    },
    operatingLocation: {
        type: String,
        required: true,
        trim: true
    },
    serviceRadius: {
        type: String,
        enum: ['local', 'district', 'regional'],
        default: 'district'
    },
    assignmentCapacity: {
        type: Number,
        default: 5
    },
    currentAssignments: {
        type: Number,
        default: 0
    },
    efficiencyScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
    },
    specializations: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'assigned', 'unavailable'],
        default: 'active'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NGO', ngoSchema);