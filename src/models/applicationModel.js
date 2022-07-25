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
        type: String,
        trim: true,
        default: "Enrolled",
    },
    interview: Boolean,
    interviewDate: Date,
    sop: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    offerLetter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    offerLetterStatus: {
        type: String,
        trim: true,
        default: "Not Sent",
    },
    partialFeeReceipt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    fullFeeReceipt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    affidavit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    fileLodgedConfirmation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    passportLetter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    passportRejection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    interviewRequired: {
        type: String,
        default: "No",
    },
    sentTo: String,
    paymentStatus: String,
    allDocumentsVerified: String,
    documentsRequestedByInstitution: [{
        id: String,
        name: String,
        dueDate: {
            type: Date,
            default: Date.now,
        }
    }],
    documentsRequestedForFiling: [{
        id: String,
        name: String,
        dueDate: {
            type: Date,
            default: Date.now,
        }
    }],
    comments: [{
            comment: String,
            showToStudent: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            writtenBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
    }]
},{timestamps: true})
const Application = mongoose.model('Application', applicationSchema)
module.exports = Application;