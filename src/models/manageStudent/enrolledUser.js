const mongoose = require('mongoose');


const enrolledUserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        trim: true,
        default: 'pending'
    }
},{timestamps: true})
const enrolledUser = mongoose.model('enrolledUser', enrolledUserSchema)
module.exports = enrolledUser;