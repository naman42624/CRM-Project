require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const branchManagerAuth = require("../middlewares/branchManagerAuth")
// Controllers
const branchManagerController = require("../controllers/branchManagerController");

// // Dashboard
router.get("/", auth,branchManagerAuth, branchManagerController.dashboard);
router.get("/manageApplications", auth,branchManagerAuth, branchManagerController.manageApplications);
router.get("/manageUsers", auth,branchManagerAuth, branchManagerController.manageUsers);
router.post("/manageUsers/:id", auth,branchManagerAuth, branchManagerController.manageUsers_post);
router.get("/manageStudents", auth,branchManagerAuth, branchManagerController.manageStudents);
router.get("/tellecallerLeads", auth,branchManagerAuth, branchManagerController.tellecallerLeads);
router.get("/counsellorLeads", auth,branchManagerAuth, branchManagerController.counsellorLeads);
router.get("/scheduledWalkins", auth, branchManagerController.manageWalkins);
router.get("/followUps", auth, branchManagerController.followUp);
router.get("/manageSop", auth, branchManagerController.manageSop);



module.exports = router;
