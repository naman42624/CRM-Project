require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Controllers
const filingTeamController = require("../controllers/filingTeamController");

// Dashboard
router.get("/home", auth, filingTeamController.dashboard);

module.exports = router;