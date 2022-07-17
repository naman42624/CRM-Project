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
    console.log("hi")
    try {
        const id = req.user._id 
        // const counsellor = await User.findbyId(id);
        const counsellor = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const leads = await Leads.find({counsellor: counsellor._id, counsellorFollowUpDate: today}).populate('counsellor');
        const leadsToday = leads.length
        const hotLeads = await Leads.countDocuments({status: "Hot"})
        const avatarSrc = "data:image/png;base64," + counsellor.avatar.toString("base64");
        res.render('counsellor/Counsellor-dashboard', { counsellor, leads,tasks, hotLeads, leadsToday ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}
// hotLead(tele)--> counsellor (if after 2 followups counsellor does not mark cold then 4 more followups will be needed to mark lead cold)
module.exports.lead = async function(req,res){
    try{
        const user = req.user
        const hotLeads = await Leads.countDocuments({status: 'Hot', counsellor: req.user._id})
        const coldLeads = await Leads.countDocuments({status: 'Cold', counsellor: req.user._id})
        const allLeads = await Leads.countDocuments({counsellor: req.user._id})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('counsellor/Counsellor-leads', {hotLeads, coldLeads, avatarSrc,user ,allLeads,date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){

    }
}

module.exports.myleads = async function(req, res){
    try{
        console.log("LEADS")
    const status = req.params.status
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    if(status === "All"){
        const leads = await Leads.find({counsellor: user._id})
        console.log(leads)
        res.render("counsellor/Counsellor-leadsList", {avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting()});   
    }
    else {
        const leads = await Leads.find({counsellor: user._id, status: status})
        res.render("counsellor/Counsellor-leadsList", {avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting()});
    }
} catch(err) {
    res.send(err)
}
}


// Individual lead page for Telle-leads
module.exports.myleadsPage = async function(req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        console.log("myleadsPage");
        const lead = await Leads.findById(id);
        console.log(lead)
        res.render('counsellor/Counsellor-lead', {avatarSrc, user, lead, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.followups = async function(req,res){
    try{
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followup = await Followup.find({lead: id}).populate('lead')
        res.render('counsellor/Counsellor-followup',{avatarSrc, user, followup, leadId: id, date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){
        res.send(err)
    }
}

module.exports.myfollowups = async function(req,res){
    try{
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followup = await Followup.find({followupBy: user._id}).populate('followupBy')
        res.render('counsellor/Counsellor-followup',{avatarSrc, user, followup, date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){
        res.send(err)
    }
}

module.exports.manageStudent = async function(req, res, next) {
    try{
        const students = await enrolledUser.find({});
        res.render('manageStudent', { students });
    } catch(err){
        res.send(err);
    }
}

module.exports.updateLead = async function(req, res){
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
                    followupBy: req.user._id
                });
                newfollowup.save();
            } else {
                followup.comments = req.body.comments;
                followup.save();
            }
        });
    }
    if(req.body.counsellorFollowUpDate)
    req.body.counsellorFollowUpDate = new Date(req.body.counsellorFollowUpDate).toLocaleDateString("en-GB");

    const lead = req.body;
    console.log(lead);
    Lead.findByIdAndUpdate(id, lead, function(err, lead){
        if(err){
            console.log(err);
        } else
        if(lead) {
            if(req.params.Frompage === "i"){
            res.redirect("/myleads/" + id);
            } else {
            res.redirect("/myleads/" + req.params.Frompage);
            }
        }
    });
}
