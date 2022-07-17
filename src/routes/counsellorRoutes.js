const express = require("express");
const router = express.Router();

// Dates
const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
const today = new Date().toLocaleDateString("en-GB");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

// models
const {User} = require("../models/userModel");
const {Lead} = require("../models/leadModel");
const Document = require("../models/documentModel");

// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");


router.get("/", (req, res) => {
    res.render("counsellor/dashboard",{date: date.newDateTopBar(), greeting: getGreeting()});
});


module.exports = router;