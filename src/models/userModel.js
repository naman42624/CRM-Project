const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: String,
    address: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 10
    },
    avatar: {
        type: Buffer,
        contentType: String,
        default: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
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

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = { User };




