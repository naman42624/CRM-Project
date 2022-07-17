const mongoose = require('mongoose');

const enrolledLeadSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        trim: true,
        default: 'Pending'
    }
},{timestamps: true})

const enrolledLead = mongoose.model('enrolledLead', enrolledLeadSchema)
module.exports = enrolledLead;