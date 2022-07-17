require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");
// Controllers
const userController = require("../controllers/userController")
const { assignedBy, assignedTo, createTask } = require("../controllers/taskController");

router.get("/verify/:id/:token", auth, userController.verifyToken);

router.get("/resend/:id/:email", userController.resendEmail)

router.get("/register", userController.register_get);

router.get("/login", userController.login_get);
// User Profile Page
router.get("/profile", auth, userController.profile_get);

router.post("/register", userController.register_post);

router.get("/verify", auth, userController.verify);

router.post("/uploadAvatar", auth, upload.single("avatar"), userController.uploadAvatar);

router.delete("/deleteAvatar", auth, userController.deleteAvatar);

router.post("/login", userController.login_post);

router.get('/logout', userController.logot_get);
// Task routes
router.get("/task", auth, assignedTo);

router.post("/task/create", auth, createTask);

router.get("/task/assignedBy", auth, assignedBy);

router.get("/task/assignedTo", auth, assignedTo);

// router.get("enroll/:id", auth, userController.enroll_get);

module.exports = router;