const express = require("express");
const router = express.Router();

// middlewares
const auth = require("../middlewares/auth");
const counsAboveAuth = require("../middlewares/counsAboveAuth");
const counsellorAuth = require("../middlewares/counsellorAuth");
const isVerified = require("../middlewares/isVerified");

// Controllers
const counsellorController = require("../controllers/counsellorController");

// Dashboard
router.get("/", auth, counsAboveAuth, isVerified, counsellorAuth, counsellorController.counsellorDashboard);

// Leads Section
router.get("/leads", auth, counsAboveAuth, counsellorAuth, counsellorController.counsellorLeadsPage);

// Hot leads and cold leads list for Counsellor-leads
router.get("/leads/:status", auth, counsAboveAuth, counsellorAuth, counsellorController.leadsStatus);

// Individual lead page for counsellor-leads
router.get("/lead/:id", auth, counsAboveAuth, counsellorAuth, counsellorController.leadsPage);

// Reports Page
router.get("/reports", auth, counsAboveAuth, counsellorAuth, counsellorController.counsellorReport)

// Followups for a lead
router.get("/lead/:id/followups", auth, counsAboveAuth, counsellorAuth, counsellorController.leadFollowUp);

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/counsellor/update/:id", auth, counsAboveAuth, counsellorAuth, counsellorController.updateLead)

// Adding a new lead from telle-leads list page
router.post("/counsellor-leadsList", auth, counsAboveAuth, counsellorAuth, counsellorController.createLead);

//updating call response
router.post("/callResponse/:id", auth, counsAboveAuth, counsellorAuth, counsellorController.updateCallResponse);


module.exports = router;