const mongoose = require('mongoose');
const { Followup } = require('../models/followupModel');
const Lead = require('../models/leadModel');
const Task = require('../models/taskModel')
const {User} = require('../models/userModel')

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

module.exports.counsellorDashboard = async function(req, res) {
    try {
        const user = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const leads = await Lead.find({counsellor: user._id, counsellorFollowUpDate: today}).populate('counsellor');
        const leadsToday = leads.length
        const hotLeads = await Lead.countDocuments({status: "Hot", counsellor: user._id})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('counsellor/dashboard', { user, leads,tasks,taskCount, hotLeads, leadsToday ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        console.log(err)
        res.redirect("/500");
    }
}
// hotLead(tele)--> counsellor (if after 2 followups counsellor does not mark cold then 4 more followups will be needed to mark lead cold)

module.exports.counsellorLeadsPage = async function (req, res) {
    try{
        const user = req.user
        const hotLeads = await Lead.countDocuments({status: 'Hot', counsellor: req.user._id})
        const coldLeads = await Lead.countDocuments({status: 'Cold', counsellor: req.user._id})
        const allLeads = await Lead.countDocuments({counsellor: req.user._id})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('counsellor/leads', {hotLeads, coldLeads, avatarSrc,user ,allLeads, date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.leadsStatus = async function (req, res) {
    try {
        const status = req.params.status;
        console.log(status)
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        if (status === "All") {
            const leads = await Lead.find({counsellor: user._id})
            const count = leads.length;
            res.render("counsellor/leadsList", { avatarSrc, count, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
        else {
            const leads = await Lead.find({status, counsellor: user._id});
            const count = leads.length;
            res.render("counsellor/leadsList", { avatarSrc, count, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.leadsPage = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const lead = await Lead.findById(id).populate("counsellor")
        res.render("counsellor/lead", { avatarSrc, user,lead, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.counsellorReport = function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("counsellor/reports", { avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()  });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.leadFollowUp = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const lead = await Lead.findById(id).populate("counsellor");
        const followups = await Followup.find({ lead: id }).populate("lead followupBy");
        res.render("counsellor/followup", { avatarSrc, user, followups, lead, leadId: id, date: date.newDateTopBar(), greeting: getGreeting() });

    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.updateLead = async function (req, res) {
    try {
        const id = req.params.id;
        console.log(id);
        // update comments
        if (req.body.comments) {
            const followup = await Followup.findOne({ lead: id, date: today })
            console.log(followup)
            if (!followup) {
                const newfollowup = new Followup({
                    date: today,
                    time: new Date().toLocaleTimeString("en-GB"),
                    comments: req.body.comments,
                    lead: id,
                    followupBy: req.user._id
                });
                await newfollowup.save();
            } else {
                followup.comments = req.body.comments;
                followup.followupBy = req.user._id
                await followup.save();
            }
        }
        // update next followup date
        if (req.body.counsellorFollowUpDate) {
            req.body.counsellorFollowUpDate = new Date(req.body.counsellorFollowUpDate).toLocaleDateString("en-GB");
        }
        // update lead 
        const followup = await Followup.findOne({ lead: id})
        // const nLead = new Lead(req.body)
        const oLead = await Lead.findById(id)
        if(req.body.status === "Hot" && req.body.counsellorFollowUps >=1){
            req.body.washot = true
        }
        if(oLead.status !== req.body.status){
            req.body.counsellorFollowUps = 0
        }
        // const  nLead.toJSON()
        const newLead = await Lead.findByIdAndUpdate(id, req.body)
        if (newLead) {
            if (req.params.Frompage === "i") {
                res.redirect("/counsellor/lead/" + id);
            } else {
                res.redirect("/counsellor/leads/" + req.params.Frompage);
            }
        }
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.createLead = async function (req, res) {
    console.log(req.body);
    const lead = new Lead({
        ...req.body,
        counsellor: req.user._id
    });
    await lead.save();
    res.redirect("/counsellor/leads/" + req.body.status);
}

module.exports.updateCallResponse = async function (req, res) {
    try {
        console.log(req.body);
        const id = req.params.id;
        const callResponse = req.body.callResponse;
        console.log(tomorrow);
        const followup = await Followup.findOne({ lead: id, date: today })
        if (!followup) {
            const newfollowup = new Followup({
                date: today,
                time: new Date().toLocaleTimeString("en-GB"),
                comments: "",
                lead: id,
                call: callResponse,
                followupBy: req.user._id
            });
            await newfollowup.save();
        } else {
            followup.call = callResponse;
            followup.followupBy = req.user._id
            await followup.save();
        }
        const lead = await Lead.findByIdAndUpdate(id, { "call": callResponse })
        if (lead) {
            lead.counsellorFollowUps += 1;
            if (lead.counsellorFollowUps <= 1) {
                if (callResponse !== "Answered") {
                    lead.counsellorFollowUpDate = tomorrow;
                }
            }
            console.log(lead);
            await lead.save();
            res.redirect("/counsellor/leads/All");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}