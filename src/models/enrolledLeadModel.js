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
        type: String,
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lead : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    status: {
        type: String,
        trim: true,
        default: 'Pending'
    },
    branch: {
        type: String,
    },
},{timestamps: true})

const EnrolledLead = mongoose.model('EnrolledLead', enrolledLeadSchema)
module.exports = EnrolledLead;