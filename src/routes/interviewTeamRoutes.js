const express = require("express");
const router = express.Router();

// Dates and Greetings
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Middlewares
const auth = require("../middlewares/auth");
const interviewTeamAuth = require("../middlewares/interviewTeamAuth");
const isVerified = require("../middlewares/isVerified");

// Controllers
const interviewTeamController = require("../controllers/interviewTeamController");

// Dashboard
router.get("/", auth, interviewTeamAuth,  interviewTeamController.dashboard);
router.get("/manageApplications", auth, interviewTeamAuth, interviewTeamController.manageApplications);

router.get("/reports", auth, interviewTeamAuth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("interviewTeam/reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

module.exports = router;