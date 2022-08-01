const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    enrolledLead: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EnrolledLead'
    },
}, { timestamps: true })
const student = mongoose.model('student', studentSchema)
module.exports = student;