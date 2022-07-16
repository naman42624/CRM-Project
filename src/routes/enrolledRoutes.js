require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

// models
const {User} = require("../models/userModel");
const {Lead} = require("../models/leadModel");
const Document = require("../models/documentModel");
const EnrolledLead = require("../models/enrolledLeadModel");


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

// Routes
router.get("/application", auth, counsAboveAuth, (req, res) => {
    res.render("applications/application");
});

router.get("/profile", auth, counsAboveAuth, (req, res) => {
    res.render("applications/profile");
});

router.get("/document", auth, counsAboveAuth, (req, res) => {
    res.render("applications/document");
});

// Respective Document page route for each Enrolled Lead
router.get("/document/:enrolledId", auth, counsAboveAuth, (req, res) => {
    Document.findOne({enrolledLead: req.params.enrolledId}, function(err, document){
        if(err){
            console.log(err);
        }
        else{
            res.send(document);
        }
    });  
});

// Display uploaded files
router.get("/document/:enrolledId/:fileName", auth, counsAboveAuth, (req, res) => {
    gfs.files.findOne({filename: req.params.fileName}, (err, file) => {
        if(err){
            console.log(err);
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

router.get("/payment", auth, counsAboveAuth, (req, res) => {
    res.render("applications/payment");
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
        }
        else
        if(document){
            console.log(document);
            res.redirect("/enrolled/document");
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
        fileId: req.file.id
    }
    console.log(req.file);
    Document.findOne({enrolledLead: req.params.enrolledId, documentName: req.params.name}, (err, doc) => {
        if(err){
            console.log(err);
        }
        else{
            if(doc){
                
                doc.files.push(file);
                doc.save((err) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect("/enrolled/document");
                    }
                });
            }
            else{
                const newDoc = new Document({
                    documentName: req.params.name,
                    enrolledLead: req.params.enrolledId,
                });
                newDoc.files.push(file);
                newDoc.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect("/enrolled/document");
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
        }
        else{
            Document.findOneAndUpdate({enrolledLead: req.params.enrolledId, documentName: req.params.docName}, {$pull: {files: {fileId: req.params.fileId}}}, function(err, document){
                if(err){
                    console.log(err);
                }
                else
                if(document){
                    console.log(document);
                    res.redirect("/enrolled/document");
                }
                else{
                    console.log("No document found");
                    res.redirect("/404");
                }
            });
        }
    });
})



module.exports = router;



