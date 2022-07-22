const Task = require('../models/taskModel')
const Applications = require('../models/manageStudent/application')
const enrolledLeads = require('../models/manageStudent/enrolledUser')
// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");



module.exports.dashboard = async function(req, res) {
    console.log("Welcome Sop Team")
    try {
        const id = req.user._id 
        const sopTeam = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const applications = await Applications.find({paymentStatus: "fullFeePaid"}).limit(5);
        const applicationsCount = await Applications.countDocuments({paymentStatus: "fullFeePaid"})
        const avatarSrc = "data:image/png;base64," + sopTeam.avatar.toString("base64");
        res.render('sopTeam/Sop-dashboard', { sopTeam,applications ,tasks,taskCount,applicationsCount ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageApplications = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const sopTeam = req.user
        const applications = await Applications.find({paymentStatus: "fullFeePaid"}).populate("appliedBy");        
        const avatarSrc = "data:image/png;base64," + sopTeam.avatar.toString("base64");
        res.render('common/manageApplications', { sopTeam,user,applications,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}
