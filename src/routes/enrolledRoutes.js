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
const nodeCron = require("node-cron"); // for scheduling
 
// Models
const {User} = require("../models/userModel");
const {Lead} = require("../models/leadModel");
const Document = require("../models/documentModel");
const Application = require("../models/applicationModel");
const EnrolledLead = require("../models/enrolledLeadModel");


// Dates and greetings
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Send Status Email
const {sendStatusEmail} = require("../config/sendEmail");

// Send SMS
const {sendStatusSms, sendFeeSms} = require("../config/sendSms");

// Middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");

// Controllers
const enrolledController = require("../controllers/enrolledController");

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
    url: process.env.MONGO_URI,
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

// router.get('/manageStudents', auth ,enrolledController.showAllEnrolledUsers);
router.post('/:id', auth , counsAboveAuth, enrolledController.enroll_post);
router.get('/save/personal/:id', auth , counsAboveAuth, enrolledController.enroll_get);
router.post('/save/personal/:id', auth , counsAboveAuth, enrolledController.personal_post);
router.post('/save/academic/:id', auth , counsAboveAuth, enrolledController.academic_post);
router.get('/save/academic/:id', auth , counsAboveAuth, enrolledController.academic_get);
router.post('/save/work/edit/:enrolledId/:workId', auth , enrolledController.work_update);
router.post('/save/test/edit/:enrolledId/:testId', auth , enrolledController.test_update);
router.post('/save/work/:id', auth , counsAboveAuth, enrolledController.work_post);
router.get('/save/work/:id', auth , counsAboveAuth, enrolledController.work_get);
router.post('/save/test/:id', auth , counsAboveAuth, enrolledController.test_post);
router.get('/save/test/:id', auth , counsAboveAuth, enrolledController.test_get);

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

// Scheduling Application
// Every 2 hours
nodeCron.schedule("0 */4 * * *", async () => {
    try {
        
        let numbers = [];
        
        // console.log(numbers);
        const applications = await Application.find({}).populate('enrolledLead appliedBy');
        applications.forEach(async (application) => {
            // console.log(application.enrolledLead.branch);
            const branchManager = await User.findOne({role: "Branch Manager", branch: (application.enrolledLead)?application.enrolledLead.branch:null});
            const applicationTeam = await User.find({role: "Application Team", branch: (application.enrolledLead)?application.enrolledLead.branch:null});
            applicationTeam.forEach(async (teamMember) => {
                numbers.push(teamMember.phone);
            })
            if(application.status==="Enrolled"){
                sendStatusSms(application, branchManager, numbers);
            }
        });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Every day at 10:00
nodeCron.schedule("0 10 * * *", async () => {
    try {
        const branchManager = await User.findOne({role: "Branch Manager"});
        const applicationTeam = await User.find({role: "Application Team"});
        let numbers = [];
        applicationTeam.forEach(async (teamMember) => {
            numbers.push(teamMember.phone);
        })
        console.log(numbers);
        const applications = await Application.find({}).populate('enrolledLead appliedBy');
        applications.forEach(async (application) => {
            if(application.status==="Application Sent"){
                sendStatusSms(application, branchManager, numbers);
            }
            if(application.status==="Documents Requested By Institution"){
                numbers.push(application.enrolledLead.phone);
                sendStatusSms(application, branchManager, numbers);
            }
            if(application.status==="Documents Requested By Filing Team"){
                const filingTeam = await User.find({role: "Filing Team"});
                filingTeam.forEach(async (teamMember) => {
                    numbers.push(teamMember.phone);
                })
                sendStatusSms(application, branchManager, numbers);
            }
        });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
})

// Every 2 day at 10:00
nodeCron.schedule("0 10 */2 * *", async () => {
    try {
        const branchManager = await User.findOne({role: "Branch Manager"});
        const applicationTeam = await User.find({role: "Application Team"});
        let numbers = [];
        applicationTeam.forEach(async (teamMember) => {
            numbers.push(teamMember.phone);
        })
        console.log(numbers);
        const applications = await Application.find({}).populate('enrolledLead appliedBy');
        applications.forEach(async (application) => {
            if(application.status==="Application Applied"){
                sendStatusSms(application, branchManager, numbers);
            }
            if(application.status==="Offer Letter Received"){
                sendStatusSms(application, branchManager, numbers);
                sendFeeSms(application, branchManager, numbers);
            }
            if(application.status==="Partial Fee Paid"||application.status==="Full Fee Paid"){
                const sopTeam = await User.find({role: "SOP Team"});
                sopTeam.forEach(async (teamMember) => {
                    numbers.push(teamMember.phone);
                })
                sendStatusSms(application, branchManager, numbers);
            }
        });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
})

// Update any field of application
router.post("/application/:enrolledId/applied/:applicationId", auth, counsAboveAuth, async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const applicationId = req.params.applicationId
        const application = await Application.findByIdAndUpdate(applicationId, req.body).populate('enrolledLead appliedBy');
        console.log(req.body);
        const branchManager = await User.find({role: "Branch Manager"});
        if(application){
        if(Object.keys(req.body).length) {
            if(req.body.allDocumentsVerified)
            req.body.showStatus="Visa File Processing";
            req.body.allDocumentsVerified="checked";
        }else{
            console.log("no body");
            req.body.showStatus="Visa File Processing";
            req.body.allDocumentsVerified="unchecked";
        }
        if(req.body.status){
            sendStatusEmail(application, application.enrolledLead, req.body.status);
            sendStatusSms(application, branchManager, []);
            if(req.body.status == "Offer Letter Received"){
               sendFeeSms(application, branchManager, []);
            }
            req.body.showStatus=req.body.status;
            if(req.body.status.includes("Offer Letter")){
                req.body.offerLetterStatus = req.body.status;
            }
            if(req.body.status.includes("Fee")){
                req.body.paymentStatus = req.body.status;
            }
        }
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
                application.showStatus = "Documents Requested By Institution";
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
                application.showStatus = "Documents Requested By Filing Team";
            await Application.findByIdAndUpdate(req.params.applicationId, application);
            console.log(application);
            res.redirect("/enrolled/application/" + enrolledId+ "/applied/" + req.params.applicationId);
        }
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
})

// save comments for application
router.post("/application/:enrolledId/:applicationId/commentSend", auth, counsAboveAuth, async (req, res) => {
    try {
        console.log(req.body);
        const enrolledId = req.params.enrolledId;
        const displayApplication = await Application.findById(req.params.applicationId);
        const comment = req.body.comment;
        const newComment = {
            comment: comment,
            writtenBy: req.user._id,
            timestamp: new Date(),
        };
        displayApplication.comments.push(newComment);
        await displayApplication.save();
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
        const applications = await Application.find({enrolledLead: enrolledId}).populate('comments.writtenBy sop affidavit offerLetter partialFeeReceipt fullFeeReceipt fileLodgedConfirmation passportLetter passportRejection');
        res.render("enrolled/individual/document", {applications, enrolledLead, tenth, twelfth, bachelors, provisionalFinal, applicationForm, declaration, passport, statementOfPurpose, letterOfRecommendation, englishLanguageCertificate, portfolio, otherDocuments });
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
    if(req.body.showStatus){
        const body ={
            showStatus: req.body.showStatus
        };
         Application.findByIdAndUpdate(req.body.appId, body, (err, application) => {
            if(err){
                console.log(err);
                res.redirect("/500");
            }
        });
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
    if(req.body.showStatus){
        const body ={
            showStatus: req.body.showStatus
        };
        Application.findByIdAndUpdate(req.body.appId, body, (err, application) => {
            if(err){
                console.log(err);
                res.redirect("/500");
            }
        });
    }
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
        const students = await EnrolledLead.find({assignedTo: req.user._id}).populate("lead assignedTo enrolledBy");
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
        const applications = await Application.find({appliedBy: req.user._id}).populate("enrolledLead appliedBy");
        res.render("enrolled/manageApplications", {applications, user, avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch(err){
        console.log(err);
        res.redirect("/500");
    }
});



module.exports = router;

