const Task = require('../models/taskModel')
const Applications = require('../models/manageStudent/application')
const enrolledLeads = require('../models/manageStudent/enrolledUser')
// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");



module.exports.dashboard = async function(req, res) {
    console.log("Welcome Filing Team")
    try {
        const id = req.user._id 
        const applicationTeam = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const applications = await Applications.find({}).limit(5);
        const applicationsCount = await Applications.countDocuments({})
        const avatarSrc = "data:image/png;base64," + applicationTeam.avatar.toString("base64");
        res.render('applicationTeam/applicationTeam-dashboard', { applicationTeam,applications ,tasks,taskCount,applicationsCount ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageStudents = async function(req, res) {
    try {
        const id = req.user._id
        const user = req.user
        const applicationTeam = req.user
        const students = await enrolledLeads.find({}).populate("enrolledBy");
        const avatarSrc = "data:image/png;base64," + applicationTeam.avatar.toString("base64");
        res.render('common/manageStudents', { applicationTeam,user,students,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch(err){
        res.send(err)
    }
}


module.exports.manageApplications = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const applicationTeam = req.user
        const applications = await Applications.find({}).populate("appliedBy");        
        const avatarSrc = "data:image/png;base64," + applicationTeam.avatar.toString("base64");
        res.render('common/manageApplications', { applicationTeam,user,applications,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}
