const express = require("express");
const router = express.Router();

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Models
const Lead = require("../models/leadModel");
const {User} = require("../models/userModel");
const Task = require("../models/taskModel");

// Middlewares
const auth = require("../middlewares/auth");

router.get("/", auth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const leads = await Lead.find({scheduledWalksInDate: today});
        const leadCount = await Lead.countDocuments({$or: [{scheduledWalksInDate: {$ne: null}}, {walksInDate: {$ne: null}}]});
        const leadsToday = leads.length;
        res.render("foe/dashboard", {avatarSrc, taskCount, tasks, user, leadCount, leads, leadsToday, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.get("/reports", auth, function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("foe/reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});
router.get("/allWalkIn", auth, async (req, res) => {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const leads = await Lead.find({walksInDate: {$ne: null}}).populate('walksInBy');
        res.render("foe/allWalkIn", {avatarSrc, user, leads, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.get("/leads", auth, async (req, res) => {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const leads = await Lead.find({$or: [{scheduledWalksInDate: {$ne: null}}, {walksInDate: {$ne: null}}]}).populate('counsellor walksInBy');
        const leadCount = await Lead.countDocuments({$or: [{scheduledWalksInDate: {$ne: null}}, {walksInDate: {$ne: null}}]});
        res.render("foe/leadList", {avatarSrc, user, leadCount, leads, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
})

router.post("/addLead", auth, async (req, res) => {
    try {
        const lead = await Lead.findOne({$or: [{phone: req.body.phone}, {email: req.body.email}]});
        const body ={
            ...req.body,
            walksInDate: new Date().toLocaleDateString("en-GB"),
            walksInTime: new Date().toLocaleTimeString("en-GB"),
            walksIn: true,
            walksInBy: req.user._id,
        }
        if(lead){
           await Lead.findByIdAndUpdate(lead._id, body);
        }
        else{
            const newLead = new Lead(body);
            await newLead.save();
        }
        res.redirect("/foe/leads");
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.get("/leads/:id", auth, async (req, res) => {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const counsellors = await User.find({role: "Counsellor"});
        const lead = await Lead.findById(req.params.id).populate("counsellor");
        res.render("foe/lead", {avatarSrc, counsellors, user, lead, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/leads/:id", auth, function(req, res){
    // console.log(req.body);
    const id = req.params.id;
    console.log(id);
    const lead = req.body;
    console.log(lead);
    Lead.findByIdAndUpdate(id, lead, function(err, lead){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else
        if(lead) {
            if(req.params.Frompage === "i"){
            res.redirect("/leads/" + id);
            } 
        }
    });
});

// Mark walk in of a lead
router.post("/markWalkIn/:id", auth, async (req, res) => {
    try {
        let body;
        const lead = await Lead.findById(req.params.id);
        if(lead.walksIn){
            body ={
                walksInDate: null,
                walksInTime: null,
                walksIn: false,
                walksInBy: null,
            }
        } else {
            body ={
                walksInDate: new Date().toLocaleDateString("en-GB"),
                walksInTime: new Date().toLocaleTimeString("en-GB"),
                walksIn: true,
                walksInBy: req.user._id,
            }
        }
        await Lead.findByIdAndUpdate(req.params.id, body);
        res.redirect("/foe/leads/" + req.params.id);
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
})

module.exports = router;


