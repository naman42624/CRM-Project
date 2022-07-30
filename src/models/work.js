const mongoose = require('mongoose');


const workSchema = new mongoose.Schema({
    companyName: {
        type: String,
        trim: true
    },
    jobTitle: {
        type: String,
        trim: true
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    workLocation: {
        type: String,
        trim: true
    },
    reasonForLeaving: {
        type: String,
        trim: true
    },
    workanyOtherInformation: {
        type: String,
        trim: true
    },
    enrolledLead:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EnrolledLead'
    },
},{timestamps: true})
const work = mongoose.model('work', workSchema)
module.exports = work;
