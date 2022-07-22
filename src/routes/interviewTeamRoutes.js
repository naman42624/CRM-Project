require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Controllers
const interviewTeamController = require("../controllers/interviewTeamController");

// Dashboard
router.get("/home", auth, interviewTeamController.dashboard);
router.get("/manageApplications", auth, interviewTeamController.manageApplications);

module.exports = router;

module.exports = router;