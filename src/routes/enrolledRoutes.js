require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

// models
const {User} = require("../models/userModel");
const {Lead} = require("../models/leadModel");
const Document = require("../models/documentModel");
const Application = require("../models/applicationModel");
const EnrolledLead = require("../models/enrolledLeadModel");

// Status Array

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");


// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");
const { log } = require("console");

router.use(methodOverride("_method")); // for put and delete requests of files in forms (to update and delete) 

// init gridfs stream
const conn = mongoose.connection; // get the connection
let gfs, gridfsBucket;
conn.once("open", () => {
    // Init stream
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});


// multer storage engine
const storage = new GridFsStorage({
    url: "mongodb://localhost:27017/DummyCRM",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    enrolledLead: req.body.enrolledLead,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// Routes

// Apply for applications
router.get("/application/:enrolledId/applyTo", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await EnrolledLead.findById(enrolledId);
        const applications = await Application.find({enrolledLead: enrolledId});
        res.render("enrolled/individual/application" , {applications, enrolledId, enrolledLead});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Submit application
router.post('/application/:enrolledId/applyTo', auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
            const newApplication = new Application({
                ...req.body,
                appliedBy: req.user._id,
                appliedAt: new Date(),
                enrolledLead: enrolledId,
            });
            newApplication.save();
            res.redirect("/enrolled/application/" + enrolledId+ "/applyTo");
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Applied Application List
router.get("/application/:enrolledId/applied/:applicationId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await EnrolledLead.findById(enrolledId);
        const applications = await Application.find({ enrolledLead: enrolledId });
        const displayApplication = await Application.findById(req.params.applicationId).populate('comments.writtenBy sop affidavit offerLetter partialFeeReceipt fullFeeReceipt fileLodgedConfirmation passportLetter passportRejection');
        res.render("enrolled/individual/applicationApplied" , {displayApplication, applications, enrolledId, enrolledLead, user: req.user});
    }
     catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Update any field of application
router.post("/application/:enrolledId/applied/:applicationId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        console.log(req.body);
        if(Object.keys(req.body).length) {
            if(req.body.allDocumentsVerified)
            req.body.allDocumentsVerified="checked";
        }else{
            console.log("no body");
            req.body.allDocumentsVerified="unchecked";
        }
        if(req.body.status.includes("Offer Letter")){
            req.body.offerLetterStatus = req.body.status;
        }
        if(req.body.status.includes("Fee")){
            req.body.paymentStatus = req.body.status;
        }
        const displayApplication = await Application.findByIdAndUpdate(req.params.applicationId, req.body);
        res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Add documents requested by institution
router.post("/application/:enrolledId/applied/:applicationId/:requestedBy", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        if(req.params.requestedBy === "documentsRequestedByInstitution"){
            const oldApplication = await Application.findById(req.params.applicationId);
            const application = await Application.findOne({_id: req.params.applicationId}).select({documentsRequestedByInstitution: {$elemMatch: {id: req.body.id} } });
            console.log(application);
            console.log(application.documentsRequestedByInstitution);
            if(application.documentsRequestedByInstitution.length){
                oldApplication.documentsRequestedByInstitution[req.body.id-1] = req.body;
                application.documentsRequestedByInstitution = oldApplication.documentsRequestedByInstitution;
                }
                else {
                    oldApplication.documentsRequestedByInstitution.push(req.body);
                    application.documentsRequestedByInstitution = oldApplication.documentsRequestedByInstitution;
                }
            await Application.findByIdAndUpdate(req.params.applicationId, application);
            console.log(application);
            res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
        }
        if(req.params.requestedBy === "documentsRequestedForFiling"){
            const oldApplication = await Application.findById(req.params.applicationId);
            const application = await Application.findOne({_id: req.params.applicationId}).select({documentsRequestedForFiling: {$elemMatch: {id: req.body.id} } });
            console.log(application);
            console.log(application.documentsRequestedForFiling);
            if(application.documentsRequestedForFiling.length){
                oldApplication.documentsRequestedForFiling[req.body.id-1] = req.body;
                application.documentsRequestedForFiling = oldApplication.documentsRequestedForFiling;
                }
                else {
                    oldApplication.documentsRequestedForFiling.push(req.body);
                    application.documentsRequestedForFiling = oldApplication.documentsRequestedForFiling;
                }
            await Application.findByIdAndUpdate(req.params.applicationId, application);
            console.log(application);
            res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
        }
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }

})

// save comments
router.post("/application/:enrolledId/applied/:applicationId/comment", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const displayApplication = await Application.findById(req.params.applicationId);
        const comment = req.body.comment;
        const newComment = {
            comment: comment,
            writtenBy: req.user._id,
            timestamp: new Date(),
        };
        displayApplication.comments.push(newComment);
        displayApplication.save();
        res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// toggle checkbox of show student comments
router.post("/application/:enrolledId/applied/:applicationId/comment/:commentId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const displayApplication = await Application.findById(req.params.applicationId);
        const comment = displayApplication.comments.id(req.params.commentId);
        if(req.body.showToStudent === "on"){
            comment.showToStudent = "checked";
        }
        else{
            comment.showToStudent = "unchecked";
        }
        displayApplication.save();
        res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});





// Profile Page
router.get("/profile/:enrolledId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await EnrolledLead.findById(enrolledId);
        res.render("enrolled/individual/profile" , {enrolledId, enrolledLead});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Respective Document page route for each Enrolled Lead
router.get("/document/:enrolledId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await EnrolledLead.findById(enrolledId);
        const tenth = await Document.findOne({enrolledLead: enrolledId, documentName: "10th"});
        const twelfth = await Document.findOne({enrolledLead: enrolledId, documentName: "12th"});
        const bachelors = await Document.findOne({enrolledLead: enrolledId, documentName: "bachelors"});
        const provisionalFinal = await Document.findOne({enrolledLead: enrolledId, documentName: "provisionalFinal"});
        const applicationForm = await Document.findOne({enrolledLead: enrolledId, documentName: "applicationForm"});
        const declaration = await Document.findOne({enrolledLead: enrolledId, documentName: "declaration"});
        const passport = await Document.findOne({enrolledLead: enrolledId, documentName: "passport"});
        const statementOfPurpose = await Document.findOne({enrolledLead: enrolledId, documentName: "statementOfPurpose"});
        const letterOfRecommendation = await Document.findOne({enrolledLead: enrolledId, documentName: "letterOfRecommendation"});
        const englishLanguageCertificate = await Document.findOne({enrolledLead: enrolledId, documentName: "englishLanguageCertificate"});
        const portfolio = await Document.findOne({enrolledLead: enrolledId, documentName: "portfolio"});
        const otherDocuments = await Document.findOne({enrolledLead: enrolledId, documentName: "otherDocuments"});
        res.render("enrolled/individual/document", { enrolledLead, tenth, twelfth, bachelors, provisionalFinal, applicationForm, declaration, passport, statementOfPurpose, letterOfRecommendation, englishLanguageCertificate, portfolio, otherDocuments });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Display uploaded files
router.get("/document/:enrolledId/:fileName", auth, counsAboveAuth, (req, res) => {
    gfs.files.findOne({filename: req.params.fileName}, (err, file) => {
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else{
            if(!file || file.length === 0){
                return res.status(404).json({
                    err: "No file exists"
                });
            }
            const readstream = gridfsBucket.openDownloadStream(file._id);
            res.set("Content-Type" , "application/pdf");
            readstream.pipe(res);
        }
    });
});

router.get("/payment/:enrolledId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await EnrolledLead.findById(enrolledId);
        res.render("enrolled/individual/payment" , {enrolledId, enrolledLead});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Toggle valid document or not
router.post("/checkbox/:enrolledId/:name", auth, counsAboveAuth, (req, res) => {
    let valid = "unchecked";
    console.log(req.body.isValid);
    if(req.body.isValid=== "on"){
        valid = "checked";
    }
    Document.findOneAndUpdate({enrolledLead: req.params.enrolledId, documentName: req.params.name}, {isValid: valid}, function(err, document){
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else
        if(document){
            console.log(document);
            if(document.documentName.includes("sop")||document.documentName.includes("offerLetter")||document.documentName.includes("feeReceipt")||document.documentName.includes("affidavit")||document.documentName.includes("fileLodgedConfirmation")||document.documentName.includes("passportLetter")||document.documentName.includes("passportRejection")){
                res.redirect("/enrolled/application/" + req.params.enrolledId+ "/applied/" + req.body.appId);
            } else {
                res.redirect("/enrolled/document/" + req.params.enrolledId);
            }
        }
        else{
            console.log("No document found");
            res.redirect("/404");
        }
    });
})

// Upload document
router.post("/document/:enrolledId/:name", auth, counsAboveAuth, upload.single("file"), (req, res) => {
    const file = {
        fileName: req.file.filename,
        originalFileName: req.file.originalname,
        fileId: req.file.id,
        uploadedBy: req.user.id
    }
    console.log(req.file);
    let appDoc;
    if(req.params.name === "sop"||req.params.name === "offerLetter"||req.params.name === "fullFeeReceipt"||req.params.name === "partialFeeReceipt"||req.params.name === "affidavit"||req.params.name === "fileLodgedConfirmation"||req.params.name === "passportLetter"||req.params.name === "passportRejection"){
        appDoc = req.params.name;
        req.params.name = req.params.name+new Date();
    }
    Document.findOne({enrolledLead: req.params.enrolledId, documentName: req.params.name}, (err, doc) => {
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else{
            if(doc){
                if(doc.documentName === "sop"){
                    Application.findById(req.body.appId, function(err, application){
                        if(err){
                            console.log(err);
                            res.redirect("/500");
                        } else{
                            application.sop.push(doc._id);
                            application.save();
                        }
                    });
                }
                doc.files.push(file);
                doc.save((err) => {
                    if(err){
                        console.log(err);
                        res.redirect("/500");
                    }
                    else{
                        if(doc.documentName === "sop"){
                            res.redirect("/enrolled/application/" + req.params.enrolledId+ "/applied/" + req.body.appId);
                        } else {
                            res.redirect("/enrolled/document/" + req.params.enrolledId);
                        }
                    }
                });
            }
            else{
                const newDoc = new Document({
                    documentName: req.params.name,
                    enrolledLead: req.params.enrolledId,
                });
                if(newDoc.documentName.includes("sop")){
                    Application.findById(req.body.appId, function(err, application){
                        if(err){
                            console.log(err);
                            res.redirect("/500");
                        } else{
                            application.sop.push(newDoc._id);
                            application.save();
                        }
                    });
                }
                else{
                    Application.findByIdAndUpdate(req.body.appId, {[appDoc]: newDoc._id}, function(err, application){
                        if(err){
                            console.log(err);
                            res.redirect("/500");
                        }
                    });
                }
                newDoc.files.push(file);
                newDoc.save((err)=>{
                    if(err){
                        console.log(err);
                        res.redirect("/500");
                    }
                    else{
                        if(newDoc.documentName.includes(appDoc)){
                            res.redirect("/enrolled/application/" + req.params.enrolledId+ "/applied/" + req.body.appId);
                        } else {
                            res.redirect("/enrolled/document/" + req.params.enrolledId);
                        }
                    }
                });
            }
        }
    });
});

// Delete uploaded files by fileId
router.delete("/file/:enrolledId/:docName/:fileId", auth, counsAboveAuth, (req, res) => {
    console.log(req.params.fileId);
    const obj_id = new mongoose.Types.ObjectId(req.params.fileId);
    gridfsBucket.delete(obj_id, (err) => {
        if(err){
            console.log("error");
            console.log(err);
            res.redirect("/500");
        }
        else{
            Document.findOneAndUpdate({enrolledLead: req.params.enrolledId, documentName: req.params.docName}, {$pull: {files: {fileId: req.params.fileId}}}, function(err, document){
                if(err){
                    console.log(err);
                    res.redirect("/500");
                }
                else
                if(document){
                    console.log(document);
                    res.redirect("/enrolled/document/" + req.params.enrolledId);
                }
                else{
                    console.log("No document found");
                    res.redirect("/404");
                }
            });
        }
    });
})

router.get("/manageStudents", auth, counsAboveAuth, async (req, res) => {
    try{
        const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const students = await EnrolledLead.find({}).populate("lead assignedTo enrolledBy");
        res.render("enrolled/manageStudents", {students, user, avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch(err){
        console.log(err);
        res.redirect("/500");
    }
});

router.get("/manageApplications", auth, counsAboveAuth, async (req, res) => {
    try{
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const applications = await Application.find({}).populate("enrolledLead appliedBy");
        res.render("enrolled/manageApplications", {applications, user, avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch(err){
        console.log(err);
        res.redirect("/500");
    }
});



module.exports = router;



