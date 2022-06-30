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
// const Task = require("./src/models/task");
const Tellecaller = require("../models/tellecallerModel");
const {Followup} = require("../models/followupModel");
// const Foe = require("./src/models/foe");

// Library for utility functions for general tasks
const _ = require('lodash');

// Dashboard
router.get("/", function(req, res){
    Lead.find({telleFollowUpDate: today}, function(err, leads){
        if(err){
            console.log(err);
        } else {
            const leadsToday = leads.length;
             Lead.countDocuments({status: "Hot"}, function(err, hotLeads){
                if(err){
                    console.log(err);
                } else {
                    res.render("Telle-dashboard", {leads: leads, leadsToday: leadsToday, hotLeads: hotLeads, date: date.newDateTopBar(), greeting: getGreeting()});
                }
            });
        }
    })
});

// User Profile Page
router.get("/profile", function(req, res){
    res.render("profile", {date: date.newDateTopBar(), greeting: getGreeting()});
});

// Leads section
router.get("/Telle-leads", function(req, res){
    res.render("Telle-leads", {date: date.newDateTopBar(), greeting: getGreeting()});
});

// All Followups
router.get("/allFollowups", function(req, res){
    Followup.find({}, function(err, followups){
        if(err){
            console.log(err);
        } else {
            res.render("allFollowups", {followups: followups, date: date.newDateTopBar(), greeting: getGreeting()});
        }
    }).populate("lead");
});

// Hot leads and cold leads list for Telle-leads
router.get("/Telle-leads/:status", function(req, res){
    const status = _.capitalize(req.params.status);
    // console.log(status);
    if(status === "All"){
        Lead.find({}, function(err, leads){
            if(err){
                console.log(err);
            } else {
                res.render("Telle-leadsList", {leads: leads, status: status, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        });
    }
    else {
        Lead.find({status: status}, function(err, leads){
            if(err){
                console.log(err);
            } else
            if(leads) {
                res.render("Telle-leadsList", {leads: leads, status: status, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        });
    }
});

// Individual lead page for Telle-leads
router.get("/leads/:id", function(req, res){ 
    const id = req.params.id;
    Lead.findById(id, function(err, lead){
        if(err){
            console.log(err);
        } else
        if(lead) {
            res.render("lead", {lead: lead, date: date.newDateTopBar(), greeting: getGreeting()});
        }
    });
});

router.get("/Telle-task", function(req, res){
    res.render("Telle-task");
});

router.get("/Telle-reports", function(req, res){
    res.render("Telle-reports");
});

// Followups for a lead
router.get("/leads/:id/followups", function(req, res){
    const id = req.params.id;
    Followup.find({lead: id}, function(err, followups){
        if(err){
            console.log(err);
        } else {
            res.render("followup", {followups: followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting()});
        }
    }).populate("lead");
});

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/leads/:id", function(req, res){
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

    const lead = req.body;
    console.log(lead);
    Lead.findByIdAndUpdate(id, lead, function(err, lead){
        if(err){
            console.log(err);
        } else
        if(lead) {
            if(req.params.Frompage === "i"){
            res.redirect("/leads/" + id);
            } else {
            res.redirect("/Telle-leads/" + req.params.Frompage);
            }
        }
    });
})

// Adding a new lead from telle-leads list page
router.post("/Telle-leadsList", function(req, res){
    console.log(req.body);
    const lead = new Lead(req.body);
    lead.save();
    res.redirect("/Telle-leads/" + req.body.leadStatus);
});

router.post("/callResponse/:id", function(req, res){
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
                call : callResponse
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

module.exports = router;