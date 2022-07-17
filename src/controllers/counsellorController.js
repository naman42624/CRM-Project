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
        const hotLeads = await Leads.countDocuments({status: 'Hot', counsellor: req.user._id})
        const coldLeads = await Leads.countDocuments({status: 'Cold', counsellor: req.user._id})
        const allLeads = await Leads.countDocuments({counsellor: req.user._id})
        console.log(hotLeads)
        console.log(coldLeads)
        console.log(allLeads)
        const avatarSrc = "data:image/png;base64," + counsellor.avatar.toString("base64");
        res.render('counsellor/Counsellor-leads', {hotLeads, coldLeads, avatarSrc ,allLeads,date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){

    }
}

module.exports.myleads = function(req, res){
    try{
    const status = _.capitalize(req.params.status);
    const user = req.user;
    const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
    if(status === "All"){
        const leads = Leads.find({Counsellor: user._id})
        res.render("counsellor/Counsellor-leadsList", {avatarSrc: avatarSrc, user: user, leads: leads, status: status, date: date.newDateTopBar(), greeting: getGreeting()});   
    }
    else {
        const leads = Leads.find({Counsellor: user._id, status: status})
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
        const leads = await Leads.findbyId({ id });
        res.render('counsellor/Counsellor-lead', {avatarSrc, user, leads, date: date.newDateTopBar(), greeting: getGreeting()});
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
        res.render('counsellor/Counsellor-followup',{avatarSrc, user, followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting()})
    } catch(err){
        res.send(err)
    }
}

module.exports.myfollowups = async function(req,res){
    try{
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followup = await Followup.find({followupBy: user._id}).populate('followupBy')
        res.render('counsellor/Counsellor-followup',{avatarSrc, user, followups, date: date.newDateTopBar(), greeting: getGreeting()})
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