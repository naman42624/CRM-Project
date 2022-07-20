const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: String,
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
        name:  {
            type: String,
            trim: true,
            default: 'Enrolled'
        },
        value: {
            type: Number,
            default: 1
        }
    },
    interview: Boolean,
    sop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    payment: String,
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