const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const excelToJson = require('convert-excel-to-json');
const bodyParser = require('body-parser');
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
//connect to db  
// mongoose.connect('mongodb://localhost:27017/DummyCRM', { useNewUrlParser: true }).then(() => console.log('connected to db')).catch((err) => console.log(err))

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Models
const Lead = require("../models/leadModel");
const { User } = require("../models/userModel");
const Task = require("../models/taskModel");
const { Followup } = require("../models/followupModel");

// Middlewares
const auth = require("../middlewares/auth");
const telleAuth = require("../middlewares/telleAuth");
const isVerified = require("../middlewares/isVerified");

// Controllers

// Library for utility functions for general tasks
const _ = require('lodash');

// Dashboard
router.get("/", auth, telleAuth, isVerified, async function (req, res) {
    // console.log(req.user);
    // console.log(req.session);
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const tasks = await Task.find({ assingnedTo: req.user._id, status: { $ne: "Completed" } }).populate('assingnedBy')
        const taskCount = await Task.countDocuments({ assingnedTo: req.user._id , status: { $ne: "Completed" } }).populate('assingnedBy');
        const leads = await Lead.find({ telleFollowUpDate: today , tellecaller: req.user._id });
        const leadsToday = leads.length;
        const hotLeads = await Lead.countDocuments({ status: "Hot" , tellecaller: req.user._id });
        res.render("tellecaller/Telle-dashboard", { avatarSrc: avatarSrc, taskCount, tasks, user: user, leads: leads, leadsToday: leadsToday, hotLeads: hotLeads, date: date.newDateTopBar(), greeting: getGreeting() });

    } catch (error) {
        console.log(error);
        res.status(500).redirect("/500");
    }
});

//upload excel file
router.post('/uploadfile', upload.single("uploadfile"), (req, res) => {
    // console.log(req.file);
    const filePath = __dirname + '/../../public/uploads/' + req.file.filename;
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            // Excel Sheet Name
            name: 'Sheet1',
            // Header Row -> be skipped and will not be present at our result object.
            header: {
                rows: 1
            },
            // Mapping columns to keys
            columnToKey: {
                A: 'name',
                B: 'email',
                C: 'phone',
            }
        }]
    });
    // -> Log Excel Data to Console
    console.log(excelData);
    console.log(excelData.Sheet1);
    try{
    excelData.Sheet1.forEach(async (lead) => {
        const newLead = new Lead({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            tellecaller: req.user._id,
            branch : req.user.branch,
            leadFrom : "Excel",
        });
        await newLead.save();

    })
    res.redirect('/tellecaller/Telle-leads/All');
    }catch(err){
        console.log(err);
        res.redirect("/500");
    }

    fs.unlinkSync(filePath);
});

// Leads section
router.get("/Telle-leads", auth, telleAuth, async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const hotCount = await Lead.countDocuments({ status: "Hot" , tellecaller: req.user._id});
        const coldCount = await Lead.countDocuments({ status: "Cold" , tellecaller: req.user._id});
        const allCount = await Lead.countDocuments({ tellecaller: req.user._id});
        res.render("tellecaller/Telle-leads", { hotCount, coldCount, allCount, avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// All Followups
router.get("/allFollowups", auth, async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followups = await Followup.find({ followupBy: user._id }).populate("lead followupBy");
        res.render("allFollowups", { avatarSrc, user, followups, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Hot leads and cold leads list for Telle-leads
router.get("/Telle-leads/:status", auth, telleAuth, async function (req, res) {
    try {
        const status = _.capitalize(req.params.status);
        // console.log(status);
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        if (status === "All") {
            const leads = await Lead.find({tellecaller: req.user._id}).populate("tellecaller");
            const count = leads.length;
            res.render("tellecaller/Telle-leadsList", { count, avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
        else {
            const leads = await Lead.find({ status: status , tellecaller: req.user._id}).populate("tellecaller");
            const count = leads.length;
            res.render("tellecaller/Telle-leadsList", { count, avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Individual lead page for Telle-leads
router.get("/leads/:id", auth, telleAuth, async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const counsellors = await User.find({ role: "Counsellor" });
        const lead = await Lead.findById(id).populate("counsellor");
        res.render("tellecaller/Telle-lead", { avatarSrc, user, counsellors, lead, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.get("/Telle-reports", auth, telleAuth, async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("tellecaller/Telle-reports", { avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Followups for a lead
router.get("/leads/:id/followups", auth, async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followups = await Followup.find({ lead: id , followupBy: user._id}).populate("lead followupBy");
        res.render("tellecaller/Telle-followup", { avatarSrc, user, followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/leads/:id", auth, telleAuth, function (req, res) {
    // console.log(req.body);
    const id = req.params.id;
    console.log(id);
    if (req.body.telleFollowUpDate)
        req.body.telleFollowUpDate = new Date(req.body.telleFollowUpDate).toLocaleDateString("en-GB");
    if (req.body.scheduledWalksInDate)
        req.body.scheduledWalksInDate = new Date(req.body.scheduledWalksInDate).toLocaleDateString("en-GB");

    const lead = req.body;
    console.log(lead);
    Lead.findByIdAndUpdate(id, lead, function (err, lead) {
        if (err) {
            console.log(err);
            res.redirect("/500");
        } else
            if (lead) {
                if (req.params.Frompage === "i") {
                    res.redirect("/tellecaller/leads/" + id);
                } else {
                    res.redirect("/tellecaller/Telle-leads/" + req.params.Frompage);
                }
            }
    });
})

// Adding a new lead from telle-leads list page
router.post("/Telle-leadsList", auth, telleAuth, async function (req, res) {
    try {
        console.log(req.body);
        const lead = new Lead({
            ...req.body,
            tellecaller: req.user._id,
            branch: req.user.branch,
        });
        await lead.save();
        if(req.body.status === "- Select Status -") {
            res.redirect("/tellecaller/Telle-leads/All");
        } else {
        res.redirect("/tellecaller/Telle-leads/" + req.body.status);
        }
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.post("/callResponse/:id", auth, telleAuth, function (req, res) {
    console.log(req.body);
    const id = req.params.id;
    const callResponse = req.body.callResponse;

    console.log(tomorrow);
    const lead = {
        call: callResponse,
        comments: req.body.comments,
    };

    const newfollowup = new Followup({
        date: today,
        time: new Date().toLocaleTimeString("en-GB"),
        comments: req.body.comments,
        lead: id,
        call: callResponse,
        followupBy: req.user.id
    });
    newfollowup.save();

    Lead.findByIdAndUpdate(id, lead, function (err, lead) {
        if (err) {
            console.log(err);
            res.redirect("/500");
        } else
            if (lead) {
                lead.telleFollowUps += 1;
                // console.log(lead);
                if (lead.telleFollowUps <= 1) {
                    if (callResponse !== "Answered") {
                        lead.telleFollowUpDate = tomorrow;
                    }
                }
                console.log(lead);
                lead.save();
                res.redirect("/tellecaller/Telle-leads/All");
            }
    });
});


module.exports = router;


