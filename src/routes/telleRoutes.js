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
const {Followup} = require("../models/followupModel");

const auth = require("../middlewares/auth");

// Controllers

// Library for utility functions for general tasks
const _ = require('lodash');

// Dashboard
router.get("/", auth , async function(req, res){
    // console.log(req.user);
    // console.log(req.session);
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
    const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        Lead.find({telleFollowUpDate: today}, function(err, leads){
            if(err){
                console.log(err);
                res.redirect("/500");
            } else {
                const leadsToday = leads.length;
                 Lead.countDocuments({status: "Hot"}, function(err, hotLeads){
                    if(err){
                        console.log(err);
                        res.redirect("/500");
                    } else {
                        res.render("tellecaller/Telle-dashboard", {avatarSrc: avatarSrc, taskCount, tasks, user: user, leads: leads, leadsToday: leadsToday, hotLeads: hotLeads, date: date.newDateTopBar(), greeting: getGreeting()});
                    }
                });
            }
        })
});



// Leads section
router.get("/Telle-leads", auth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const hotCount = await Lead.countDocuments({status: "Hot"});
        const coldCount = await Lead.countDocuments({status: "Cold"});
        const allCount = await Lead.countDocuments();
        res.render("tellecaller/Telle-leads", {hotCount, coldCount, allCount, avatarSrc,  user, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

// All Followups
router.get("/allFollowups", auth, function(req, res){
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    Followup.find({followupBy: user._id}, function(err, followups){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else {
            res.render("allFollowups", {avatarSrc: avatarSrc, user: user, followups: followups, date: date.newDateTopBar(), greeting: getGreeting()});
        }
    }).populate("lead followupBy");
});

// Hot leads and cold leads list for Telle-leads
router.get("/Telle-leads/:status", auth, function(req, res){
    const status = _.capitalize(req.params.status);
    // console.log(status);
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    if(status === "All"){
        Lead.find({}, function(err, leads){
            if(err){
                console.log(err);
                res.redirect("/500");
            } else {
                const count = leads.length;
                res.render("tellecaller/Telle-leadsList", {count, avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        });
    }
    else {
        Lead.find({status: status}, function(err, leads){
            if(err){
                console.log(err);
                res.redirect("/500");
            } else
            if(leads) {
                const count = leads.length;
                res.render("tellecaller/Telle-leadsList", {count, avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        });
    }
});

// Individual lead page for Telle-leads
router.get("/leads/:id", auth, async function(req, res){ 
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const counsellors = await User.find({role: "Counsellor"});
        Lead.findById(id, function(err, lead){
            if(err){
                console.log(err);
            } else
            if(lead) {
                res.render("tellecaller/Telle-lead", {avatarSrc: avatarSrc, user: user, counsellors, lead: lead, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        }).populate("counsellor");
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
    
});

router.get("/Telle-reports", auth, function(req, res){
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    res.render("tellecaller/Telle-reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
});

// Followups for a lead
router.get("/leads/:id/followups", auth, function(req, res){
    const id = req.params.id;
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    Followup.find({lead: id}, function(err, followups){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else {
            res.render("tellecaller/Telle-followup", {avatarSrc: avatarSrc, user: user, followups: followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting()});
        }
    }).populate("lead followupBy");
});

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/leads/:id", auth, function(req, res){
    // console.log(req.body);
    const id = req.params.id;
    console.log(id);
    if(req.body.comments){
        Followup.findOne({lead: id, date: today}, function(err, followup){
            if(!followup){
                const newfollowup = new Followup({
                    date: today,
                    time: new Date().toLocaleTimeString("en-GB"),
                    comments: req.body.comments,
                    lead : id,
                });
                newfollowup.save();
            } else {
                followup.comments = req.body.comments;
                followup.save();
            }
        });
    }
    if(req.body.telleFollowUpDate)
    req.body.telleFollowUpDate = new Date(req.body.telleFollowUpDate).toLocaleDateString("en-GB");
    if(req.body.scheduledWalksInDate)
    req.body.scheduledWalksInDate = new Date(req.body.scheduledWalksInDate).toLocaleDateString("en-GB");

    const lead = req.body;
    console.log(lead);
    Lead.findByIdAndUpdate(id, lead, function(err, lead){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else
        if(lead) {
            if(req.params.Frompage === "i"){
            res.redirect("/tellecaller/leads/" + id);
            } else {
            res.redirect("/tellecaller/Telle-leads/" + req.params.Frompage);
            }
        }
    });
})

// Adding a new lead from telle-leads list page
router.post("/Telle-leadsList", auth, function(req, res){
    console.log(req.body);
    const lead = new Lead(req.body);
    lead.save();
    res.redirect("/Telle-leads/" + req.body.status);
});

router.post("/callResponse/:id", auth, function(req, res){
    console.log(req.body);
    const id = req.params.id;
    const callResponse = req.body.callResponse;
    
    console.log(tomorrow);
    const lead = {
        call: callResponse
    };
    Followup.findOne({lead: id, date: today}, function(err, followup){
        if(!followup){
            const newfollowup = new Followup({
                date: today,
                time: new Date().toLocaleTimeString("en-GB"),
                comments: "",
                lead : id,
                call : callResponse,
                followupBy: req.user.id
            });
            newfollowup.save();
        } else {
            followup.call = callResponse;
            followup.save();
        }
    });

    Lead.findByIdAndUpdate(id, lead, function(err, lead){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else
        if(lead) {
            lead.telleFollowUps += 1;
            // console.log(lead);
            if(lead.telleFollowUps<=1){
                if(callResponse !== "Answered"){
                    lead.telleFollowUpDate = tomorrow;
                }
            }
            console.log(lead);
            lead.save();
            res.redirect("/Telle-leads/All");
        }
    });
});

// Task routes


module.exports = router;