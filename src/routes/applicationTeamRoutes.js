const express = require("express");
const router = express.Router();

// Dates and Greetings
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Middlewares
const auth = require("../middlewares/auth");
const applicationTeamAuth = require("../middlewares/applicationTeamAuth");

// Controllers
const applicationTeamController = require("../controllers/applicationTeamController");

// Dashboard
router.get("/", auth, applicationTeamAuth, applicationTeamController.dashboard);
router.get("/manageApplications", auth, applicationTeamAuth, applicationTeamController.manageApplications);
router.get("/manageStudents", auth, applicationTeamAuth, applicationTeamController.manageStudents);

router.get("/reports", auth, applicationTeamAuth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("applicationTeam/reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

module.exports = router;