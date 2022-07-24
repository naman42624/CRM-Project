const Task = require('../models/taskModel')
const Application = require('../models/applicationModel');
const EnrolledLead = require('../models/enrolledLeadModel');

// Dates and Greeting
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");


module.exports.dashboard = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const tasks = await Task.find({assingnedTo: id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: id}).populate('assingnedBy');
        const applications = await Application.find({}).populate('enrolledLead').limit(5);
        const applicationsCount = await Application.countDocuments({})
        const studentsCount = await EnrolledLead.countDocuments({})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('applicationTeam/dashboard', { studentsCount, user,applications ,tasks,taskCount,applicationsCount ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.manageApplications = async function(req, res) {
    try {
        const user = req.user
        const applications = await Application.find({}).populate("appliedBy");        
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('enrolled/manageApplications', {user,applications,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.manageStudents = async function(req, res) {
    try {
        const user = req.user
        const students = await EnrolledLead.find({}).populate("lead assignedTo enrolledBy");        
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('enrolled/manageStudents', {user,students,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}