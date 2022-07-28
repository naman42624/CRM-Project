const mongoose = require('mongoose');


const academicSchema = new mongoose.Schema({
    countryOfStudy: {
        type: String,
        trim: true,
        default: "India"
    },
    highestDegree: {
        type: String,
        trim: true
    },

    masterName: {
        type: String,
        trim: true
    },
    masterUniversity: {
        type: String,
        trim: true
    },
    masterLocation: {
        type: String,
        trim: true
    },
    masterGrade: {
        type: String,
        trim: true
    },
    masterYearOfPassing: {
        type: String,
        trim: true
    },

    undergraduateName: {
        type: String,
        trim: true
    },
    undergraduateUniversity: {
        type: String,
        trim: true
    },
    undergraduateLocation: {
        type: String,
        trim: true
    },
    undergraduateGrade: {
        type: String,
        trim: true
    },
    undergraduateYearOfPassing: {
        type: String,
        trim: true
    },

    twelveBoard: {
        type: String,
        trim: true
    },
    twelveSchool: {
        type: String,
        trim: true
    },
    twelveLocation: {
        type: String,
        trim: true
    },
    twelveGrade: {
        type: String,
        trim: true
    },
    twelveYearOfPassing: {
        type: String,
        trim: true
    },

    tenthBoard: {
        type: String,
        trim: true
    },
    tenthSchool: {
        type: String,
        trim: true
    },
    tenthLocation: {
        type: String,
        trim: true
    },
    tenthGrade: {
        type: String,
        trim: true
    },
    tenthYearOfPassing: {
        type: String,
        trim: true
    },
    enrolledLead:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EnrolledLead'
    },
},{timestamps: true})
const academic = mongoose.model('academic', academicSchema)
module.exports = academic;
