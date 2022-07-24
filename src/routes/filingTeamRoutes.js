const express = require("express");
const router = express.Router();

const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// Middlewares
const auth = require("../middlewares/auth");
const filingTeamAuth = require("../middlewares/filingTeamAuth");
const isVerified = require("../middlewares/isVerified");

// Controllers
const filingTeamController = require("../controllers/filingTeamController");

// Dashboard
router.get("/", auth, filingTeamAuth, isVerified, filingTeamController.dashboard);
router.get("/manageApplications", auth, filingTeamAuth, filingTeamController.manageApplications);

router.get("/reports", auth, filingTeamAuth, async function(req, res){
    try {
        const user = req.user;
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("filingTeam/reports", {avatarSrc, user, date: date.newDateTopBar(), greeting: getGreeting()});
    }
    catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

module.exports = router;