const mongoose = require('mongoose');


const testSchema = new mongoose.Schema({
     
    testName: {
        type: String,
        trim: true
    },
    overallScore: {
        type: String,
        trim: true
    },
    readingScore: {
        type: String,
        trim: true
    },
    writingScore: {
        type: String,
        trim: true
    },
    listeningScore: {
        type: String,
        trim: true
    },
    speakingScore: {
        type: String,
        trim: true
    },
    testDate: {
        type: Date,
        default: Date.now
    },
    testLocation: {
        type: String,
        trim: true
    },
    trfNo: {
        type: String,
        trim: true
    },
    enrolledLead:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EnrolledLead'
    },
},{timestamps: true})
const test = mongoose.model('test', testSchema)
module.exports = test;


