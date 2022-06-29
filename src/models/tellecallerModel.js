const mongoose = require("mongoose");

const tellecallersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Tellecaller = mongoose.model("Tellecallers", tellecallersSchema);

module.exports = Tellecaller;