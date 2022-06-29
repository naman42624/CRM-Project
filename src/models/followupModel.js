const mongoose = require("mongoose");

const followupSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        // required: true
    },
    call: {
        type: String,
        // required: true
    },
    followupBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true
    }
});

const Followup = mongoose.model("Followup", followupSchema);

module.exports = { Followup, followupSchema };