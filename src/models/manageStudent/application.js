const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    enrolledLead:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'enrolledUser'
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
const application = mongoose.model('application', applicationSchema)
module.exports = application;