require("dotenv").config();
const express = require("express");
const router = express.Router();
const {User} = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");
const sharp = require("sharp");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");

// For email verification
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

// models
const Tellecaller = require("../models/tellecallerModel");
const Task = require("../models/taskModel");

// Controllers
const { assignedBy, assignedTo, createTask } = require("../controllers/taskController");

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

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendEmail = async (user) => {
    const token = uuidv4() + user.id;
    const url = "http://localhost:3000/user/verify/" + user.id + "/" + token;

    const hashedToken = await bcrypt.hash(token, 10);
        const userVerification = new UserVerification({
            userId: user.id,
            token: hashedToken,
            createdAt: new Date(),      
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        });
        userVerification.save((err)=>{
                if(err){
                    console.log(err);
                    res.redirect("/500");
                }
                else{
                    console.log("User verification saved")
                }
            });
            const resendUrl = "http://localhost:3000/user/resend/" + user.id + "/" + user.email; 

    let mailOptions = {
        from: 'Bells Overseas <'+process.env.EMAIL+'>',
        to: user.email,
        subject: "Verify your Bells Overseas Email Address",
        html: `<h1>Verify your email</h1>
                <h2>Hi ${user.name},</h2>
                <p>Thanks for signing up to Bells Overseas!</p>
                <p>Please click on the link below to verify your email and proceed further.</p>
                <a href=${url}><button style="background-color:green;">Verify</button></a>
                <br>
                <p> This link will expire after <b style="color:red;">2 hours</b>. To request another verification link, please click <a href=${resendUrl}>here</a>.</p>
                <p>If you did not sign up to <b>Bells Overseas</b>, please ignore this email.</p>
                <p>Regards,</p>
                <p>Bells Overseas.</p>
                `
    };
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
            res.redirect("/500");
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

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
                                user.save((err)=>{
                                    if(err){
                                        console.log(err);
                                        res.redirect("/500");
                                    }
                                    else{
                                        console.log("User logged in");
                                        if(user.role === "TelleCaller"){
                                            res.redirect("/telecaller/");
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
        username: req.body.username,
        name: req.body.name,
        email: req.body.username,
        address: req.body.address,
        phone: req.body.phone,
        role: req.body.role,
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
        req.user.avatar = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
        await req.user.save();
        console.log(req.user);
        res.redirect("/user/profile");
    }
    catch(err){
        res.status(500).send(err);
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
                    res.redirect("/tellecaller");
                }
                else if(req.user.role === "Counsellor"){
                    res.redirect("/counsellor");
                }
                else if(req.user.role === "FOE"){
                    res.redirect("/foe");
                }
                else if(req.user.role === "Branch Manager"){
                    res.redirect("/branchManager");
                }
                else if(req.user.role === "SOP Team"){
                    res.redirect("/sopTeam");
                }
                else if(req.user.role === "Filing Team"){
                    res.redirect("/filingTeam");
                }
                else if(req.user.role === "Application Team"){
                    res.redirect("/applicationTeam");
                }
                else if(req.user.role === "Interview Team"){
                    res.redirect("/interviewTeam");
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

// Task routes
router.get("/task", auth, assignedTo);
router.post("/task/create", auth, createTask);
router.get("/task/assignedBy", auth, assignedBy);
router.get("/task/assignedTo", auth, assignedTo);

module.exports = router;