
require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

// models
const { User } = require("../models/userModel");
const Document = require("../models/manageStudent/documentModel");
const Application = require("../models/manageStudent/application");
const Lead = require('../models/leadModel');
const academic = require('../models/manageStudent/academic');
const work = require('../models/manageStudent/work');
const test = require('../models/manageStudent/test');
const personal = require('../models/manageStudent/personalInfo');
const enrolledUser = require('../models/manageStudent/enrolledUser');

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");


// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");
// let {gfs, gridfsBucket} = require("../middlewares/documentUpload");
// const {upload} = require("../middlewares/documentUpload");

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






module.exports.showAllEnrolledUsers = async (req, res) => {
    try {
        const enrolledStudents = await enrolledUser.find({});
        res.render('common/enrolledStudents', { enrolledStudents });
    } catch (err) {
        res.send(err);
    }
}


module.exports.enroll_post = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        const eLead = await enrolledUser.findOne({ lead: req.params.id });
        if (!eLead) {
            const user = await enrolledUser.create({
                name: lead.name,
                username: lead.email,
                phone: lead.phone,
                enrollmentDate: new Date(),
                enrolledBy: req.user.id,
                lead: lead._id
            });
            console.log(user);
            await user.save();
            res.redirect('/enrolled/enroll/get/' + user.id);
        }
        else {
            res.redirect('/enrolled/enroll/get/' + eLead._id);
        }
    } catch (err) {
        res.send(err);
    }
}
module.exports.personal_get = async (req, res) => {
    const id = req.params.id;
    console.log("personal");
    try {
        const personalInfo = await personal.findOne({ user: id });
        const academicInfo = await academic.findOne({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/enroll', { enrolledLead, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.personal_post = async (req, res) => {
    try {
        const personalO = await personal.findOne({ enrolledLead: req.params.id });
        console.log(personalO);
        if (personalO) {
            await personal.findOneAndUpdate({ enrolledLead: req.params.id }, req.body)
        }
        else {
            const personalInfo = await personal.create({
                ...req.body,
                enrolledLead: req.params.id,
            });
            console.log(personalInfo);
            await personalInfo.save();
        }
        res.redirect('/enroll/get/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
}

module.exports.academic_get = async (req, res) => {
    const id = req.params.id;
    console.log("academic");
    try {
        const personalInfo = await personal.findOne({ enrolledLead: id });
        const academicInfo = await academic.findOne({ enrolledLead: id });
        const workInfo = await work.find({ enrolledLead: id });
        const testInfo = await test.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('common/educational', { enrolledLead, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.academic_post = async (req, res) => {
    try {
        console.log("hi");
        const academicO = await academic.findOne({ enrolledLead: req.params.id });
        console.log(academicO);
        if (academicO) {
            console.log("if")
            await academic.findOneAndUpdate({ enrolledLead: req.params.id }, req.body);
        }
        else {
            console.log("else");
            const academicInfo = await academic.create({
                ...req.body,
                enrolledLead: req.params.id,
            });
            console.log(academicInfo);
            await academicInfo.save();
        }
        res.redirect('/enrolled/save/academic/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
}

module.exports.work_get = async (req, res) => {
    const id = req.params.id;
    console.log("work");
    try {
        const personalInfo = await personal.findOne({ enrolledLead: id });
        const academicInfo = await academic.findOne({ enrolledLead: id });
        const workInfo = await work.find({ enrolledLead: id });
        const testInfo = await test.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('common/work', { enrolledLead, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.work_post = async (req, res) => {
    try {
        const workO = await work.find({ enrolledLead: req.params.id });
        console.log(workO);
        if (workO) {
            await work.findOneAndUpdate({ enrolledLead: req.params.id }, req.body);
        }
        else {
            const workInfo = await work.create({
                ...req.body,
                enrolledLead: req.params.id,
            });
            console.log(workInfo);
            await workInfo.save();
        }
        res.redirect('/enrolled/enroll/get/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_get = async (req, res) => {
    const id = req.params.id;
    console.log("test");
    try {
        const personalInfo = await personal.findOne({ enrolledLead: id });
        const academicInfo = await academic.findOne({ enrolledLead: id });
        const workInfo = await work.find({ enrolledLead: id });
        const testInfo = await test.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('common/test', { enrolledLead, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_post = async (req, res) => {
    try {
        const testInfo = await test.create({
            ...req.body,
            enrolledLead: req.params.id,
        });
        console.log(testInfo);
        await testInfo.save();
        res.redirect('/enrolled/enroll/get/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
}


module.exports.enroll_get = async (req, res) => {
    const id = req.params.id;
    try {
        const personalInfo = await personal.find({ enrolledLead: id });
        const academicInfo = await academic.find({ enrolledLead: id });
        const workInfo = await work.find({ enrolledLead: id });
        const testInfo = await test.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('common/enroll', { enrolledLead, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}


module.exports.profile = async (req, res) => {
    try {
        res.redirect('/enrolled/enroll/get/' + req.params.id);
    } catch (err) {
        res.send(err);
    }
}

module.exports.document = async (req, res) => {
    try {
        const enrolledId = req.params.enrolledId;
        const enrolledLead = await enrolledUser.findById(enrolledId);
        const tenth = await Document.findOne({ enrolledLead: enrolledId, documentName: "10th" });
        const twelfth = await Document.findOne({ enrolledLead: enrolledId, documentName: "12th" });
        const bachelors = await Document.findOne({ enrolledLead: enrolledId, documentName: "bachelors" });
        const provisionalFinal = await Document.findOne({ enrolledLead: enrolledId, documentName: "provisionalFinal" });
        const applicationForm = await Document.findOne({ enrolledLead: enrolledId, documentName: "applicationForm" });
        const declaration = await Document.findOne({ enrolledLead: enrolledId, documentName: "declaration" });
        const passport = await Document.findOne({ enrolledLead: enrolledId, documentName: "passport" });
        const statementOfPurpose = await Document.findOne({ enrolledLead: enrolledId, documentName: "statementOfPurpose" });
        const letterOfRecommendation = await Document.findOne({ enrolledLead: enrolledId, documentName: "letterOfRecommendation" });
        const englishLanguageCertificate = await Document.findOne({ enrolledLead: enrolledId, documentName: "englishLanguageCertificate" });
        const portfolio = await Document.findOne({ enrolledLead: enrolledId, documentName: "portfolio" });
        const otherDocuments = await Document.findOne({ enrolledLead: enrolledId, documentName: "otherDocuments" });
        res.render("common/document", { enrolledLead, tenth, twelfth, bachelors, provisionalFinal, applicationForm, declaration, passport, statementOfPurpose, letterOfRecommendation, englishLanguageCertificate, portfolio, otherDocuments });
    } catch (error) {
        console.log(error);
    }
}

module.exports.displayDocument = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.fileName })

        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        }
        const readstream = await gridfsBucket.openDownloadStream(file._id);
        res.set("Content-Type", "application/pdf");
        readstream.pipe(res);
    } catch (error) {
        console.log(error);
    }
}

module.exports.isValid = async (req, res) => {
    try {
        let valid = "unchecked";
        console.log(req.body.isValid);
        if (req.body.isValid === "on") {
            valid = "checked";
        }
        const document = await Document.findOneAndUpdate({ enrolledLead: req.params.enrolledId, documentName: req.params.name }, { isValid: valid })

        if (document) {
            console.log(document);
            res.redirect("/enrolled/document/" + req.params.enrolledId);
        }
        else {
            console.log("No document found");
            res.redirect("/404");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.upload = async (req, res) => {
    try {
        const file = {
            fileName: req.file.filename,
            originalFileName: req.file.originalname,
            fileId: req.file.id
        }
        console.log(req.file);
        const doc = await Document.findOne({ enrolledLead: req.params.enrolledId, documentName: req.params.name })

        if (doc) {

            doc.files.push(file);
            doc.save((err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/enrolled/document/" + req.params.enrolledId);
                }
            });
        }
        else {
            const newDoc = new Document({
                documentName: req.params.name,
                enrolledLead: req.params.enrolledId,
            });
            newDoc.files.push(file);
            newDoc.save((err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/enrolled/document/" + req.params.enrolledId);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.deleteFile = (req, res) => {
    try {
        console.log(req.params.fileId);
        const obj_id = new mongoose.Types.ObjectId(req.params.fileId);
        gridfsBucket.delete(obj_id, (err) => {
            if (err) {
                console.log("error");
                console.log(err);
            }
            else {
                Document.findOneAndUpdate({ enrolledLead: req.params.enrolledId, documentName: req.params.docName }, { $pull: { files: { fileId: req.params.fileId } } }, function (err, document) {
                    if (err) {
                        console.log(err);
                    }
                    else
                        if (document) {
                            console.log(document);
                            res.redirect("/enrolled/document/" + req.params.enrolledId);
                        }
                        else {
                            console.log("No document found");
                            res.redirect("/404");
                        }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.application = async (req, res) => {
    try {
        const enrolledId = req.params.id;
        const enrolledLead = await enrolledUser.findById(enrolledId);
        const application = await Application.findOne({ enrolledLead: enrolledId });
        res.render("common/applicationForm", { enrolledLead, application });
    } catch (error) {
        console.log(error);
    }
}

module.exports.applicationSubmit = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await Application.findByIdAndUpdate(id, req.body);
        if(application){
            if(req.body.status === "partialFeePaid"){
                application.paymentStatus = "partialFeePaid";
                await application.save();

            }
            else if(req.body.status === "fullFeePaid"){
                application.paymentStatus = "fullFeePaid";
                await application.save();
            }
            else if(req.body.status === "offerLetterReceived"){
                application.offerLetterStatus = "offerLetterReceived";
                await application.save();
            }
            console.log("application  updated");
            console.log(application);
            res.redirect("/enrolled/application/list/" + id);
        }
        else{
        const enrolledId = req.params.id;
        const application = await Application.findOne({ enrolledLead: enrolledId });
            const newApplication = new Application({
                ...req.body,
                appliedBy: req.user._id,
                enrolledLead: enrolledId,
            });
            newApplication.save((err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // res.redirect("/enrolled/application/list/" + req.params.enrolledId);
                    res.redirect("/enrolled/application/list/" + newApplication._id);

                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.applicationList = async (req, res) => {
    try {
        console.log("application list");
        const id = req.params.id;
        console.log(id);
        const selectedApplication = await Application.findById(id);
        console.log(selectedApplication);
        if(selectedApplication){
            const enrolledId = selectedApplication.enrolledLead;
            const enrolledLead = await enrolledUser.findById(enrolledId);
            console.log(enrolledLead);
            console.log(selectedApplication.enrolledLead);
            
            const application = await Application.find({ enrolledLead: enrolledId });
        res.render("common/applicationList", { application, enrolledLead ,selectedApplication, user: req.user });
        }
        else{
            const enrolledId = req.params.id;
            const application = await Application.find({ enrolledLead: enrolledId });
            const enrolledLead = await enrolledUser.findById(enrolledId);
            res.render("common/applicationList", { application, enrolledLead, selectedApplication: application[0], user: req.user });
        }
    } catch (error) {
        console.log(error);
    }
}