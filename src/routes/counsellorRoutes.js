require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");
// Controllers
const counsellorController = require("../controllers/counsellorController");

router.get("/counsellor/home", auth, counsellorController.counsellorDashboard);
// router.get("/counsellor_profile", auth, counsellorController.counsellorProfile);
// router.get("/counsellor/tasks", auth, counsellorController.counsellorTasks);
router.get("/counsellor/myleads/:status", auth, counsellorController.myleads);
router.get("/counsellor/leads", auth, counsellorController.lead);
// router.get("/myleads/:id", auth, counsellorController.myleadsPage);
// router.get("/managestudents", auth, counsellorController.managestudents);

module.exports = router;