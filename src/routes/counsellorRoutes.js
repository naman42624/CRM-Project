require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Controllers
const counsellorController = require("../controllers/counsellorController");

// Dashboard
router.get("/counsellor/home", auth, counsellorController.counsellorDashboard);

// Leads Section
router.get("/counsellor-leads", auth, counsellorController.counsellorLeadsPage);

// All Followups
router.get("/counsellor/allFollowups", auth, counsellorController.allFollowUps);

// Hot leads and cold leads list for Counsellor-leads
router.get("/counsellor-leads/:status", auth, counsellorController.leadsStatus);

// Individual lead page for counsellor-leads
router.get("/counsellor/leads/:id", auth, counsellorController.leadsPage);

// Reports Page
router.get("/counsellor-reports", auth, counsellorController.counsellorReport)

// Followups for a lead
router.get("/counsellor-leads/:id/followups", auth, counsellorController.leadFollowUp);

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/counsellor/update/:id", auth, counsellorController.updateLead)

// Adding a new lead from telle-leads list page
router.post("/counsellor-leadsList", auth, counsellorController.createLead);

//updating call response
router.post("/counsellor/callResponse/:id", auth, counsellorController.updateCallResponse);

module.exports = router;