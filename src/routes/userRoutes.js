require("dotenv").config();
const express = require("express");
const router = express.Router();
const {User} = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");
const sharp = require("sharp");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");

// For email verification 
require("../config/transporter");
const bcrypt = require("bcrypt");
const {sendEmail, sendMessage} = require("../config/sendEmail");

// models
const Tellecaller = require("../models/tellecallerModel");
const Task = require("../models/taskModel");
const Application = require("../models/applicationModel");
// Controllers
const { assignedBy, assignedTo, createTask, updateTask } = require("../controllers/taskController");

const passport = require('passport');
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

passport.use(User.createStrategy()); // createStrategy is a method of passportLocalMongoose

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});


// @route   GET /user/verify/:id/:token
// @desc    Verify user email and redirect to dashboard
router.get("/verify/:id/:token", auth, (req, res)=>{
    const id = req.params.id;
    const token = req.params.token;
    UserVerification.findOne({userId: id}, (err, userVerification)=>{
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else if(userVerification){
            if(userVerification.expiresAt > Date.now()){
                bcrypt.compare(token, userVerification.token, (err, result)=>{
                    if(result){
                        User.findById(id, (err, user)=>{
                            if(err){
                                console.log(err);
                                res.redirect("/500");
                            }
                            else if(user){
                                user.isVerified = true;
                                UserVerification.findOneAndDelete({userId: id}, (err)=>{
                                    if(err){
                                        console.log(err);
                                        res.redirect("/500");
                                    }
                                });
                                user.save((err)=>{
                                    if(err){
                                        console.log(err);
                                        res.redirect("/500");
                                    }
                                    else{
                                        console.log("User logged in");
                                        if(user.role === "TelleCaller"){
                                            res.redirect("/tellecaller/");
                                        }
                                        else if(user.role === "Counsellor"){
                                            res.redirect("/counsellor/");
                                        }
                                        else if(user.role === "FOE"){
                                            res.redirect("/foe/");
                                        }
                                        else if(user.role === "Branch Manager"){
                                            res.redirect("/branchManager/");
                                        }
                                        else if(user.role === "SOP Team"){
                                            res.redirect("/sopTeam/");
                                        }
                                        else if(user.role === "Filing Team"){
                                            res.redirect("/filingTeam/");
                                        }
                                        else if(user.role === "Application Team"){
                                            res.redirect("/applicationTeam/");
                                        }
                                        else if(user.role === "Interview Team"){
                                            res.redirect("/interviewTeam/");
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else{
                        res.send("Invalid link");
                    }
                });
            }
            else{
                res.send("Link expired");
                res.redirect("/user/login");
            }
        }
        else{
            res.send("Invalid link");
        }
    });
});

// @route   GET /user/resend/:id/:email
// @desc    Resend email verification link
router.get("/resend/:id/:email", (req, res) => {
    UserVerification.findOneAndDelete({userId: req.params.id}, (err)=>{
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else{
            console.log("User verification deleted");
        }
    });
    User.findById(req.params.id, (err, user)=>{
        if(err){
            console.log(err);
            res.redirect("/500");
        }
        else{
            sendEmail(user);
            res.redirect("https://mail.google.com/mail/u/?authuser="+req.params.email);
        }
    });
})

router.get("/register", function(req, res){
    res.render("register");
});

router.get("/login", function(req, res){
    res.render("login");
});

// User Profile Page
router.get("/profile", auth, function(req, res){
    const user = req.user;
    const avatarSrc = "data:image/webp;base64," + user.avatar.toString("base64");
    res.render("profile", {avatarSrc: avatarSrc, user: user, date: date.newDateTopBar(), greeting: getGreeting()});
});

// Register User
router.post("/register" , function(req, res){
    console.log(req.body);
    const user = new User({
        ...req.body,
        email: req.body.username,
        isVerified: false
    });

    // user.avatar = sharp(Buffer.from("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp")).resize({width: 250, height: 250}).png().toBuffer();
    // user.avatar.contentType = "image/webp";
    console.log(user);
    
    User.register(user, req.body.password, function(err, user,){
        if(err){
            console.log(err);
            res.redirect("/user/register");
        }
        else{
            console.log("User registered");
            sendEmail(user);
            passport.authenticate("local")(req, res, function(err){
                if(err){
                    console.log(err);
                    res.redirect("/500");
                }
                else{
                    console.log("User logged in");
                res.redirect("/user/verify");
                }
            });
        }
    })
});

// Verify User page
router.get("/verify", auth, function(req, res){
    res.render("verify",{email: req.user.email, name: req.user.name});
});

// Upload avatar
router.post("/uploadAvatar", auth ,upload.single("avatar"), async function(req, res){
    console.log(req.file);
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.redirect("/user/profile");
},(error, req, res, next)=>{
    res.status(400).send({error: error.message});
}
);

// Delete avatar
router.post("/deleteAvatar", auth, async function(req, res){
    try{
        req.user.avatar = "https://freesvg.org/img/winkboy.png";
        await req.user.save();
        console.log(req.user);
        res.redirect("/user/profile");
    }
    catch(err){
        console.log(err);
        res.redirect("/500");
    }
});

// Login User
router.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
            res.redirect("/500");
        }else{
            console.log("User logged in");
            passport.authenticate("local")(req, res, function(){ // this middleware invokes req.login() to login the newly registered automatically and also creates the cookie with the session
                 //creates the cookie for the session to allow user to access all pages that requires authentication
                if(req.user.role === "TelleCaller"){
                    res.redirect("/tellecaller/");
                }
                else if(req.user.role === "Counsellor"){
                    res.redirect("/counsellor/");
                }
                else if(req.user.role === "FOE"){
                    res.redirect("/foe/");
                }
                else if(req.user.role === "Branch Manager"){
                    res.redirect("/branchManager/");
                }
                else if(req.user.role === "SOP Team"){
                    res.redirect("/sopTeam/");
                }
                else if(req.user.role === "Filing Team"){
                    res.redirect("/filingTeam/");
                }
                else if(req.user.role === "Application Team"){
                    res.redirect("/applicationTeam/");
                }
                else if(req.user.role === "Interview Team"){
                    res.redirect("/interviewTeam/");
                }
                else if(req.user.role === "Student"){
                    // const student = User.findById(req.user._id, (err, student)=>{
                    //     if(err){
                    //         console.log(err);
                    //         res.redirect("/500");
                    //     }
                    //     else{
                    //         res.redirect("//"+student.username);
                    //     }
                    // });
                    Application.findOne({enrolledLead: req.user.enrolledLead}, (err, lead)=>{
                        if(err){
                            console.log(err);
                            res.redirect("/500");
                        }
                        else{
                            if(lead){
                                res.redirect("/enrolled/application/"+req.user.enrolledLead+"/applied/"+lead._id);
                            }
                            else{
                                res.redirect("/enrolled/save/personal/"+req.user.enrolledLead);
                            }
                        }
                    }).populate("enrolledLead");
                }
            });
        }
    });
});

// Logout User
router.get('/logout', function(req, res){
    req.logout(function(err) {
        if (err) {
            console.log(err); 
            res.redirect("/500");
        }else{
            res.redirect('/user/login');
        }
      });
});


// Contact Us Page
router.get("/contactManagement", auth, async (req, res)=>{
    try {
        const user = req.user;
        const users = await User.find({});
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("contactManagement", { users, user, avatarSrc, date: date.newDateTopBar(), greeting: getGreeting()});
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});

router.post("/contactManagement", auth, async (req, res)=>{
    try {
        const from = req.user;
        const to = await User.findById(req.body.sendTo);
        sendMessage(from, to, req.body.message);
        res.redirect("/user/contactManagement");
    } catch (error) {
        console.log(error);
        res.redirect("/500");
    }
});



// Task routes
router.get("/task", auth, assignedTo);
router.post("/task/create", auth, createTask);
router.get("/task/assignedBy", auth, assignedBy);
router.get("/task/assignedTo", auth, assignedTo);
router.post("/task/:id", auth, updateTask);

module.exports = router;