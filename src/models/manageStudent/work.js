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
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
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
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'enrolledUser'
    },
},{timestamps: true})
const work = mongoose.model('work', workSchema)
module.exports = work;
