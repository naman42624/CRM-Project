const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const enrolledController = require('../controllers/enrolledController');
const auth = require('../middlewares/auth');
const counsAboveAuth = require('../middlewares/counsAboveAuth');
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
router.use(methodOverride("_method")); // for put and delete requests of files in forms (to update and delete) 
const { User } = require("../models/userModel");
const Document = require("../models/manageStudent/documentModel");
const Application = require("../models/manageStudent/application");
const Lead = require('../models/leadModel');
const academic = require('../models/manageStudent/academic');
const work = require('../models/manageStudent/work');
const test = require('../models/manageStudent/test');
const personal = require('../models/manageStudent/personalInfo');
const enrolledUser = require('../models/manageStudent/enrolledUser');
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

router.get('/manageStudents', auth ,enrolledController.showAllEnrolledUsers);
router.post('/enroll/:id', auth , enrolledController.enroll_post);
router.get('/enroll/get/:id', auth , enrolledController.enroll_get);
router.post('/save/personal/:id', auth , enrolledController.personal_post);
// router.get('/save/personal/:id', auth , enrolledController.personal_get);
router.post('/save/academic/:id', auth , enrolledController.academic_post);
router.get('/save/academic/:id', auth , enrolledController.academic_get);
router.post('/save/work/:id', auth , enrolledController.work_post);
router.get('/save/work/:id', auth , enrolledController.work_get);
router.post('/save/test/:id', auth , enrolledController.test_post);
router.get('/save/test/:id', auth , enrolledController.test_get);
router.get('/profile/:id', auth , enrolledController.profile);
router.get('/document/:enrolledId', auth , enrolledController.document);
router.get('/application/:id', auth , enrolledController.application);
router.post('/application/:id', auth , enrolledController.applicationSubmit);
router.get('/application/list/:id', auth , enrolledController.applicationList);
// router.get('/payment/:id', auth , enrolledController.payment);


// Display uploaded files
router.get("/document/:enrolledId/:fileName", auth, counsAboveAuth, async (req, res) => {
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
});

// Toggle valid document or not
router.post("/checkbox/:enrolledId/:name", auth, counsAboveAuth, async (req, res) => {
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
);

// Upload document
router.post("/document/:enrolledId/:name", auth, counsAboveAuth, upload.single("file"), async (req, res) => {
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
});

// Delete uploaded files by fileId
router.delete("/file/:enrolledId/:docName/:fileId", auth, counsAboveAuth, (req, res) => {
    try {
        console.log(req.params.fileId);
        const obj_id = new mongoose.Types.ObjectId(req.params.fileId);
        gridfsBucket.delete(obj_id, (err) => {
            if(err){
                console.log("error");
                console.log(err);
            }
            else{
                Document.findOneAndUpdate({enrolledLead: req.params.enrolledId, documentName: req.params.docName}, {$pull: {files: {fileId: req.params.fileId}}}, function(err, document){
                    if(err){
                        console.log(err);
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
    } catch (error) {   
        console.log(error);
    }
}
);


module.exports = router;