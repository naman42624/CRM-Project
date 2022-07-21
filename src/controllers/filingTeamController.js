const Task = require('../models/taskModel')
const Applications = require('../models/manageStudent/application')
// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");



module.exports.dashboard = async function(req, res) {
    console.log("Welcome Filing Team")
    try {
        const id = req.user._id 
        const filingTeam = req.user
        const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        const applications = await Applications.find({offerLetterStatus: "offerLetterReceived"});
        const applicationsCount = await Applications.countDocuments({offerLetterStatus: "offerLetterReceived"})
        const avatarSrc = "data:image/png;base64," + filingTeam.avatar.toString("base64");
        res.render('filingTeam/filingTeam-dashboard', { filingTeam,applications ,tasks,taskCount,applicationsCount ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}
