const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    maritalStatus: {
        type: String,
    },
    address: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    passportNumber: {
        type: String,
        trim: true
    },
    passportissue: {
        type: String,
        trim: true
    },
    passportExpiry: {
        type: String,
        trim: true
    },
    passportIssueCountry: {
        type: String,
        trim: true
    },
    placeOfBirth: {
        type: String,
        trim: true
    },
    citizenOfTwo: {
        type: String,
        default: "false"
    },
    citizenOfTwoName: {
        type: String,
        trim: true
    },
    liveOrStudyinOtherCountry: {
        type: String,
        default: "false",
    },
    liveOrStudyinOtherCountryName: {
        type: String,
        trim: true
    },
    appliedForImmigrationInAnyCountry: {
        type: String,
        default: "false",
    },
    appliedForImmigrationInAnyCountryName: {
        type: String,
        trim: true
    },
    anySeriousMedicalCondition: {
        type: String,
        default: "false",
    },
    anySeriousMedicalConditionName: {
        type: String,
        trim: true
    },
    anyRefusals: {
        type: String,
        default: "false",
    },
    anyRefusalsName: {
        type: String,
        trim: true
    },
    anyRefusalsType: {
        type: String,
        trim: true
    },
    anyCriminalConvictions: {
        type: String,
        default: "false",
    },
    anyCriminalConvictionsName: {
        type: String,
        trim: true
    },
    emergencyname: {
        type: String,
        trim: true
    },
    emergencyphone: {
        type: String,
        trim: true
    },
    emergencyrelationship: {
        type: String,
        trim: true
    },
    emergencyemail: {
        type: String,
        trim: true
    },

    anyOtherInformation: {
        type: String,
        trim: true
    },
    enrolledLead:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'enrolledUser'
    },
}, { timestamps: true })
const personal = mongoose.model('personal', personalSchema)
module.exports = personal;