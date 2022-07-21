const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    enrolledLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'enrolledUser',
    },
    program: {
        type: String,
        required: true,
        trim: true,
    },
    institution: {
        type: String,
        required: true,
        trim: true
    },
    intake: {
        type: String,
        required: true,
        trim: true
    },
    appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        default: "Not Paid",
    },
    offerLetterStatus: {
        type: String,
        default: "Not Sent",
    },
    interviewRequired: {
        type: String,
        default: "No",
    },
    status: {
        type: String,
        trim: true,
        default: "enrolled",
    },
    sentTo:{
        type: String,
        trim: true
    },
    comments: [{
        comment: {
            type: String,
            writtenBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    }]
},{timestamps: true})
const Application = mongoose.model('Application', applicationSchema)
module.exports = Application;