const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
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
        default: "https://freesvg.org/img/winkboy.png"
    },
    role: {
        type: String,
        default: "User"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = { User };




