const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    documentName: String,
    files:[{
        originalFileName : String,
        fileName: String,
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "uploads.files"
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    isValid: {
        type: String,
        default: "unchecked"
    },
    enrolledLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EnrolledLead"
    }
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;