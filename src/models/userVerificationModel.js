const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    }
});

const UserVerification = mongoose.model("UserVerification", verificationSchema);

module.exports = UserVerification;