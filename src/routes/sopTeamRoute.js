require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Controllers
const sopTeamController = require("../controllers/sopTeamController");

// Dashboard
router.get("/home", auth, sopTeamController.dashboard);
router.get("/manageApplications", auth, sopTeamController.manageApplications);

module.exports = router;

module.exports = router;