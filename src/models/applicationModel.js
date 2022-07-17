const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    enrolledLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnrolledLead'
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
        required: true,
        ref: 'User'
    },
    appliedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    comments: [{
        comment: {
            type: String,
            required: true,
            writtenBy: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    }]
},{timestamps: true})
const Application = mongoose.model('Application', applicationSchema)
module.exports = Application;