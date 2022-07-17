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


router.get("/",auth, counsAboveAuth, async (req, res) => {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy');
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const leads = await Lead.find({telleFollowUpDate: today}).populate('counsellor');
        res.render("counsellor/dashboard",{date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;