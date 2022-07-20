const express = require("express");
const router = express.Router();

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// models
const {User} = require("../models/userModel");
const Lead = require("../models/leadModel");
const Task = require("../models/taskModel");
const Document = require("../models/documentModel");

// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");


// router.get("/",auth, counsAboveAuth, async (req, res) => {
//     try {
//         const user = req.user;
//         const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
//         const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy');
//         const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
//         const leads = await Lead.find({telleFollowUpDate: today}).populate('counsellor');
//         res.render("counsellor/dashboard",{avatarSrc, taskCount, tasks, user, leads, leadsToday: leadsToday, hotLeads: hotLeads, date: date.newDateTopBar(), greeting: getGreeting()});
//     } catch (error) {
//         console.log(error);
//         res.redirect("/500");
//     }
// });

// Controllers
const counsellorController = require("../controllers/counsellorController");

// Dashboard
router.get("/", auth, counsAboveAuth, counsellorController.counsellorDashboard);

// Leads Section
router.get("/leads", auth, counsAboveAuth, counsellorController.counsellorLeadsPage);

// Hot leads and cold leads list for Counsellor-leads
router.get("/leads/:status", auth, counsAboveAuth, counsellorController.leadsStatus);

// Individual lead page for counsellor-leads
router.get("/lead/:id", auth, counsAboveAuth, counsellorController.leadsPage);

// Reports Page
router.get("/reports", auth, counsAboveAuth, counsellorController.counsellorReport)

// Followups for a lead
router.get("/lead/:id/followups", auth, counsAboveAuth, counsellorController.leadFollowUp);

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/counsellor/update/:id", auth, counsAboveAuth, counsellorController.updateLead)

// Adding a new lead from telle-leads list page
router.post("/counsellor-leadsList", auth, counsAboveAuth, counsellorController.createLead);

//updating call response
router.post("/counsellor/callResponse/:id", auth, counsAboveAuth, counsellorController.updateCallResponse);


module.exports = router;