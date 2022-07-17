// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Models
const Lead = require("../models/leadModel");
const { User } = require("../models/userModel");
const Task = require("../models/taskModel");
const { Followup } = require("../models/followupModel");

// Controllers
const { assignedBy, assignedTo, createTask } = require("../controllers/taskController");

// Library for utility functions for general tasks
const _ = require('lodash');


module.exports.telleDashboard = async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const tasks = await Task.find({ assingnedTo: req.user._id }).populate('assingnedBy')
        const taskCount = await Task.countDocuments({assingnedTo: req.user._id}).populate('assingnedBy');
        console.log(tasks);
        Lead.find({ telleFollowUpDate: today }, function (err, leads) {
            if (err) {
                console.log(err);
            } else {
                const leadsToday = leads.length;
                Lead.countDocuments({ status: "Hot" }, function (err, hotLeads) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("telecaller/Telle-dashboard", { avatarSrc, user,taskCount, tasks, leads, leadsToday, hotLeads, date: date.newDateTopBar(), greeting: getGreeting() });
                    }
                });
            }
        })
    } catch (err) {
        res.send(err)
    }
}

module.exports.telleLeadsPage = async function (req, res) {
    try {
        const user = req.user;
        const hotLead = await Lead.countDocuments({status: "Hot"})
        const coldLead = await Lead.countDocuments({status: "Cold"})
        const allLeads = await Lead.countDocuments({})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("telecaller/Telle-leads", { avatarSrc: avatarSrc,hotLead,coldLead,allLeads, user, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        res.send(err)
    }
}

module.exports.allFollowUps = async function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const followUp = await Followup.find({}).populate("lead followupBy")
        res.render("telecaller/Telle-allFollowups", { avatarSrc, user, followups: followUp, date: date.newDateTopBar(), greeting: getGreeting() });
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
            const leads = await Lead.find({})
            res.render("telecaller/Telle-leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
        else {
            const leads = await Lead.find({status})
            res.render("telecaller/Telle-leadsList", { avatarSrc, user, leads, status, date: date.newDateTopBar(), greeting: getGreeting() });
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports.leadsPage = async function (req, res) {
    try {
        const id = req.params.id;
        const user = req.user;
        const counsellors = await User.find({role: "Counsellor"})
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        const lead = await Lead.findById(id).populate("counsellor")
        res.render("telecaller/Telle-lead", { avatarSrc, user, counsellors,lead, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch (err) {
        res.send(err)
    }
}

module.exports.telleReport = function (req, res) {
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("telecaller/Telle-reports", { avatarSrc, user });
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
        res.render("telecaller/Telle-followup", { avatarSrc, user, followups, leadId: id, date: date.newDateTopBar(), greeting: getGreeting() });

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
        if (req.body.telleFollowUpDate) {
            req.body.telleFollowUpDate = new Date(req.body.telleFollowUpDate).toLocaleDateString("en-GB");
        }
        // update lead 
        const newLead = await Lead.findByIdAndUpdate(id, req.body)
        if (newLead) {
            if (req.params.Frompage === "i") {
                res.redirect("/leads/" + id);
            } else {
                res.redirect("/Telle-leads/" + req.params.Frompage);
            }
        }
    } catch (err) {
        res.send(err)
    }
}

module.exports.createLead = async function (req, res) {
    console.log(req.body);
    const lead = new Lead(req.body);
    await lead.save();
    res.redirect("/Telle-leads/" + req.body.status);
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
            lead.telleFollowUps += 1;
            if (lead.telleFollowUps <= 1) {
                if (callResponse !== "Answered") {
                    lead.telleFollowUpDate = tomorrow;
                }
            }
            console.log(lead);
            await lead.save();
            res.redirect("/Telle-leads/All");
        }
    } catch (err) {
        res.send(err)
    }
}
