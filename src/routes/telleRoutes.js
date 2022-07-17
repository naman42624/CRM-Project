const express = require("express");
const { telleDashboard, allFollowUps, telleLeadsPage, leadsStatus, telleReport, leadsPage, leadFollowUp, updateLead, createLead, updateCallResponse } = require("../controllers/telleController");
const router = express.Router();

const auth = require("../middlewares/auth");

// Dashboard
router.get("/telecaller/home", auth, telleDashboard);

// Leads section
router.get("/Telle-leads", auth, telleLeadsPage);

// All Followups
router.get("/allFollowups", auth, allFollowUps);

// Hot leads and cold leads list for Telle-leads
router.get("/Telle-leads/:status", auth, leadsStatus);

// Individual lead page for Telle-leads
router.get("/leads/:id", auth, leadsPage);

// Reports Page
router.get("/Telle-reports", auth, telleReport)

// Followups for a lead
router.get("/leads/:id/followups", auth, leadFollowUp);

// Update details of a lead from individual lead page and leads list page
router.post("/:Frompage/leads/:id", auth, updateLead)

// Adding a new lead from telle-leads list page
router.post("/Telle-leadsList", auth, createLead);

//updating call response
router.post("/callResponse/:id", auth, updateCallResponse);

module.exports = router;



