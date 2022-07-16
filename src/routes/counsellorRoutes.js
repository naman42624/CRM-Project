const express = require("express");
const router = express.Router();

// models
const {User} = require("../models/userModel");
const {Lead} = require("../models/leadModel");
const Document = require("../models/documentModel");

// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");


router.get("/", (req, res) => {
    res.render("counsellor/dashboard");
});


module.exports = router;