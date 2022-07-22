require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Controllers
const applicationTeamController = require("../controllers/applicationTeamController");

// Dashboard
router.get("/home", auth, applicationTeamController.dashboard);
router.get("/manageStudents", auth, applicationTeamController.manageStudents);
router.get("/manageApplications", auth, applicationTeamController.manageApplications);

module.exports = router;

module.exports = router;