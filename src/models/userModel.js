const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10
    },
    role: {
        type: String,
        default: "user"
    },
    isTellecaller: {
        type: Boolean,
        default: false
    },
    isCounsellor: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isFoe: {
        type: Boolean,
        default: false
    }
    // tellecallerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Tellecaller"
    // },
    // counsellorId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Counsellor"
    // },
    // foeId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Foe"
    // }
});

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };




