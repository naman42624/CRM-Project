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
        default: "https://freesvg.org/img/winkboy.png"
    },
    role: {
        type: String,
        default: "User"
    },
    isVerified: {
        type: Boolean,
        default: false
    } , 
    branch: {
        type: String,
    },   
    enrolledLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EnrolledLead"
    },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = { User };




