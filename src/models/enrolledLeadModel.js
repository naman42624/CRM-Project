const mongoose = require("mongoose");

const enrolledLeadSchema = new mongoose.Schema({
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true
    }
});

const EnrolledLead = mongoose.model("EnrolledLead", enrolledLeadSchema);

module.exports = EnrolledLead;
