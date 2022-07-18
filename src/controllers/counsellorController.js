const mongoose = require('mongoose');
const { Followup } = require('../models/followupModel');
const Leads = require('../models/leadModel');
const Task = require('../models/taskModel')
const User = require('../models/userModel')
// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");


module.exports.counsellorDashboard = async function(req, res) {
    console.log("Welcome Counsellor")
    try {
        const id = req.user._id 
        const counsellor = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const leads = await Leads.find({counsellor: counsellor._id, counsellorFollowUpDate: today}).populate('counsellor');
        const leadsToday = leads.length
        const hotLeads = await Leads.countDocuments({status: "Hot", counsellor})
        const avatarSrc = "data:image/png;base64," + counsellor.avatar.toString("base64");
        res.render('counsellor/Counsellor-dashboard', { counsellor, leads,tasks,taskCount, hotLeads, leadsToday ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}
// hotLead(tele)--> counsellor (if after 2 followups counsellor does not mark cold then 4 more followups will be needed to mark lead cold)

module.exports.counsellorLeadsPage = async function (req, res) {
    try{
        const user = req.user
        const hotLeads = await Leads.countDocuments({status: 'Hot', counsellor: req.user._id})
        const coldLeads = await Leads.countDocuments({status: 'Cold', counsellor: req.user._id})
        const allLeads = await Leads.countDocuments({counsellor: req.user._id})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('counsellor/Counsellor-leads', {hotLeads, coldLeads, avatarSrc,user ,allLeads,date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){
        res.send(err)
    }
}
// lead.assignedTo = counsellor
module.exports.allFollowUps = async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followUp = await Followup.find({followupBy: user._id}).populate("lead followupBy")

        res.render("counsellor/Counsellor-allFollowups", { avatarSrc, user, followups: followUp, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        res.send(err)
    }
}

module.exports.leadsStatus = async function (req, res) {
    try {
        const status = req.params.status;
        console.log(status)
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        if (status === "All") {
            const leads = await Leads.find({counsellor: user._id})
            res.render("counsellor/Counsellor-leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
        else {
            const leads = await Leads.find({status, counsellor: user._id})
            res.render("counsellor/Counsellor-leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports.leadsPage = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const lead = await Leads.findById(id).populate("counsellor")
        res.render("counsellor/Counsellor-lead", { avatarSrc, user,lead, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        res.send(err)
    }
}

module.exports.counsellorReport = function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("counsellor/Counsellor-reports", { avatarSrc, user });
    } catch (err) {
        res.send(err)
    }
}

module.exports.leadFollowUp = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followups = await Followup.find({ lead: id }).populate("lead followupBy");
        res.render("counsellor/Counsellor-followup", { avatarSrc, user, followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting() });

    } catch (err) {
        res.send(err)
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
        // const nLead = new Leads(req.body)
        const oLead = await Leads.findById(id)
        if(oLead.status !== req.body.status){
            req.body.counsellorFollowUps = 0
        }
        if(req.body.status === "Hot" && req.body.counsellorFollowUps >=1){
            req.body.washot = true
        }
        // const  nLead.toJSON()
        const newLead = await Leads.findByIdAndUpdate(id, req.body)
        if (newLead) {
            if (req.params.Frompage === "i") {
                res.redirect("/counsellor/leads/" + id);
            } else {
                res.redirect("/counsellor-leads/" + req.params.Frompage);
            }
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports.createLead = async function (req, res) {
    console.log(req.body);
    const lead = new Leads({
        ...req.body,
        counsellor: req.user._id
    });
    await lead.save();
    res.redirect("/counsellor-leads/" + req.body.status);
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
        const lead = await Leads.findByIdAndUpdate(id, { "call": callResponse })
        if (lead) {
            lead.counsellorFollowUps += 1;
            if (lead.counsellorFollowUps <= 1) {
                if (callResponse !== "Answered") {
                    lead.counsellorFollowUpDate = tomorrow;
                }
            }
            console.log(lead);
            await lead.save();
            res.redirect("/counsellor-leads/All");
        }
    } catch (err) {
        res.send(err)
    }
}
