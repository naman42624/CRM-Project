const express = require("express");
const router = express.Router();

// Dates and Greetings
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Middlewares
const auth = require("../middlewares/auth");
const sopTeamAuth = require("../middlewares/sopTeamAuth");

// Controllers
const sopTeamController = require("../controllers/sopTeamController");

// Dashboard
router.get("/", auth, sopTeamAuth, sopTeamController.dashboard);
router.get("/manageApplications", auth, sopTeamAuth, sopTeamController.manageApplications);

router.get("/reports", auth, sopTeamAuth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("sopTeam/reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

module.exports = router;