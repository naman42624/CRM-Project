const Task = require('../models/taskModel')
const { Followup } = require('../models/followupModel');
const Applications = require('../models/applicationModel')
const {User} = require('../models/userModel');
const enrolledLeads = require('../models//enrolledLeadModel')
const Lead = require('../models/leadModel');
const followUp = require('../models/followupModel');
// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");


// Dashboard
module.exports.dashboard = async function(req, res) {
    console.log("Welcome Branch Manager")
    try {
        const id = req.user._id 
        const branchManager = req.user
        // tasks
        const tasks = await Task.find({ assingnedTo: req.user._id, status: { $ne: "Completed" } }).populate('assingnedBy')
        const taskCount = await Task.countDocuments({ assingnedTo: req.user._id , status: { $ne: "Completed" } }).populate('assingnedBy');
        // applications
        const applications = await Applications.find({branch: req.user.branch}).limit(5);
        const applicationsCount = await Applications.countDocuments({branch: req.user.branch})
        // leads
        const hotLeads = await Lead.find({status: "Hot", branch: req.user.branch}).populate('counsellor');
        const hotLeadsCount = await Lead.countDocuments({status: "Hot", branch: req.user.branch})
        // enrolledLeads
        const enrolledStudents = await enrolledLeads.find({enrollmentDate: today, branch: req.user.branch});
        const enrolledStudentsCount = await enrolledLeads.countDocuments({enrollmentDate: today, branch: req.user.branch});
        // followUp
        // const followUpsTodayCount = await followUp.countDocuments({date: today});

        const tellefollowUpsToday = await Lead.find({telleFollowUpDate: today, branch: req.user.branch});
        const tellefollowUpsTodayCount = await Lead.countDocuments({telleFollowUpDate: today, branch: req.user.branch});
        const counsellingfollowUpsToday = await Lead.find({counsellorFollowUpDate: today, branch: req.user.branch}).populate('counsellor');
        const counsellingfollowUpsTodayCount = await Lead.countDocuments({counsellorFollowUpDate: today, branch: req.user.branch});
        const followUpCount = tellefollowUpsTodayCount + counsellingfollowUpsTodayCount;

        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('branchManager/dashboard', { user: branchManager,tellefollowUpsToday,counsellingfollowUpsToday,hotLeads,enrolledStudentsCount,followUpCount,hotLeadsCount,enrolledStudents,applications ,tasks,taskCount,applicationsCount ,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageApplications = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const branchManager = req.user
        const applications = await Applications.find({branch: req.user.branch}).populate("appliedBy");        
        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('enrolled/manageApplications', { branchManager,user,applications,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageUsers = async function(req, res) {
    try {
        console.log("Manage Users")
        const id = req.user._id
        const user = req.user
        console.log(req.user.branch)
        const branchUsers = await User.find({branch: req.user.branch});
        console.log(branchUsers)
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('enrolled/manageUsers', { user,branchUsers,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        console.log(err);
        res.redirect("/500")
    }
}

module.exports.manageUsers_post = async function(req, res) {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        user.role = req.body.role
        await user.save()
        res.redirect("/branchManager/manageUsers")
    } catch (err) {
        console.log(err);
        res.redirect("/500")
    }
}

module.exports.manageStudents = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const branchManager = req.user
        const students = await enrolledLeads.find({branch: req.user.branch}).populate("enrolledBy assignedTo");

        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('enrolled/manageStudents', { branchManager,user,students,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.tellecallerLeads = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const branchManager = req.user
        const status = "Tellecaller"
        const leads = await Lead.find({counsellor:{$in: [null]} ,branch: req.user.branch}).populate('tellecaller');
        console.log(leads)
        const count = await Lead.countDocuments({counsellor:{$in: [null]} ,branch: req.user.branch});
        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('branchManager/leadsList', { branchManager,user,status,leads,avatarSrc,count, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.counsellorLeads = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const branchManager = req.user
        const status = "Counsellor"
        const leads = await Lead.find({counsellor: {$ne: null},branch: req.user.branch}).populate("counsellor tellecaller");
        console.log(leads)
        const count = await Lead.countDocuments({counsellor: {$ne: null},branch: req.user.branch});
        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('branchManager/leadsList', { branchManager,user,status,count, leads,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.scheduledWalkins = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const branchManager = req.user
        const leads = await Lead.find({walkIn: true,branch: req.user.branch }).populate("counsellor");
        const avatarSrc = "data:image/png;base64," + branchManager.avatar.toString("base64");
        res.render('branchManager/scheduledWalkins', { branchManager,user,leads,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.followUp = async function(req, res) {
    try {
        const id = req.user._id 
        const user = req.user
        const followUps = await Followup.find({branch: req.user.branch}).populate("lead followupBy");
        console.log(followUps)
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('branchManager/followup', {user,followUps,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageSop = async function(req, res) {
    try {
        console.log("Manage Sop")
        const id = req.user._id 
        const user = req.user
        const Applicationes = await Applications.find({branch: req.user.branch}).populate("appliedBy sop enrolledLead");
        Applicationes.forEach(function(application) {
        if(application.sop){
            console.log(application.sop)
            const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
            res.render('branchManager/manageSop', { user,Applicationes,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
        }
        })
    } catch (err) {
        res.send(err);
    }
}

module.exports.manageWalkins = async function(req, res) {
    try {
        console.log("Manage Walkins")
        const id = req.user._id
        const user = req.user
        const walksIns = await Lead.find({branch: req.user.branch, scheduledWalksInDate: {$ne : null}}).populate("counsellor tellecaller");
        console.log(walksIns)
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render('branchManager/manageWalkins', { user,walksIns,avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (err) {
        res.send(err);
    }
}



// module.exports.leadsStatus = async function (req, res) {
//     try {
//         const status = req.params.status;
//         console.log(status)
//         const user = req.user;
//         const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
//         if (status === "teleCaller") {
//             const leads = await Lead.find({counsellor: user._id})
//             res.render("branchManager/leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
//         }
//         else {
//             const leads = await Lead.find({status, counsellor: user._id})
//             res.render("branchManager/leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
//         }
//     } catch (err) {
//         res.send(err)
//     }
// }

module.exports.leadsPage = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const lead = await Lead.findById(id).populate("counsellor")
        res.render("branchManager/lead", { avatarSrc, user,lead, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        res.send(err)
    }
}
