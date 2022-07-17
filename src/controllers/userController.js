require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");
const sharp = require("sharp");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");

// For email verification
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const Task = require("../models/taskModel");

// Controllers
const { assignedBy, assignedTo, createTask } = require("../controllers/taskController");

const passport = require('passport');
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");

passport.use(User.createStrategy()); // createStrategy is a method of passportLocalMongoose

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
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
    userVerification.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("User verification saved")
        }
    });
    const resendUrl = "http://localhost:3000/user/resend/" + user.id + "/" + user.email;

    let mailOptions = {
        from: 'Bells Overseas <' + process.env.EMAIL + '>',
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
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports.verifyToken = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;
    await UserVerification.findOne({ userId: id }, (err, userVerification) => {
        if (err) {
            console.log(err);
        }
        else if (userVerification) {
            if (userVerification.expiresAt > Date.now()) {
                bcrypt.compare(token, userVerification.token, (err, result) => {
                    if (result) {
                        User.findById(id, (err, user) => {
                            if (err) {
                                console.log(err);
                            }
                            else if (user) {
                                user.isVerified = true;
                                user.save((err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        //    passport.authenticate("local")(req, res, ()=>{
                                        console.log("User logged in");
                                        res.redirect("/");
                                        // });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send("Invalid link");
                    }
                });
            }
            else {
                res.send("Link expired");
                res.redirect("/user/login");
            }
        }
        else {
            res.send("Invalid link");
        }
    });
}

module.exports.resendEmail = async (req, res) => {
    await UserVerification.findOneAndDelete({ userId: req.params.id }, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("User verification deleted");
        }
    });
    await User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            sendEmail(user);
            res.redirect("https://mail.google.com/mail/u/?authuser=" + req.params.email);
        }
    });
}

module.exports.register_get = async (req, res) => {
    res.render("register");
}

module.exports.register_post = async (req, res) => {
    console.log(req.body);
    const user = new User(req.body)
    // if(user.role === "Tellecaller"){
    //     await Tellecaller.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "Counsellor"){
    //     await Counsellor.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "FOE"){
    //     await Foe.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "Branch Manager"){
    //     await BranchManager.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "SOP Team"){
    //     await SopTeam.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "Filing Team"){
    //     await FilingTeam.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "Application Team"){
    //     await ApplicationTeam.create({
    //         user: user.id,
    //     });
    // }
    // else if(user.role === "Interview Team"){
    //     await InterviewTeam.create({
    //         user: user.id,
    //     });
    // }


    console.log(user);

    await User.register(user, req.body.password, function (err, user,) {
        if (err) {
            console.log(err);
            res.redirect("/user/register");
        }
        else {
            console.log("User registered");
            sendEmail(user);
            passport.authenticate("local")(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("User logged in");
                    res.redirect("/user/verify");
                }
            });
        }
    })
}

module.exports.login_get = (req, res) => {
    res.render("login");
}
module.exports.profile_get = async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
        res.render("profile", { avatarSrc: avatarSrc, user: user, date: date.newDateTopBar(), greeting: getGreeting() });
    } catch(e){
        res.status(500).send()
    }    
}
module.exports.verify = (req, res) => {
    res.render("verify", { email: req.user.email, name: req.user.name });
}
module.exports.uploadAvatar = async (req, res) => {
    console.log(req.file);
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.redirect("/user/profile");
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
}
module.exports.deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
        await req.user.save();
        res.redirect("/user/profile");
    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports.login_post = async (req, res) => {
    const user = new User(req.body)
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("User logged in");
            passport.authenticate("local")(req, res, function () { // this middleware invokes req.login() to login the newly registered automatically and also creates the cookie with the session
                if(req.user.role === "TelleCaller"){
                    res.redirect("/telecaller/home");
                }
                else if(req.user.role === "Counsellor"){
                    res.redirect("/counsellor/home");
                }
                else if(req.user.role === "FOE"){
                    res.redirect("/foe/home");
                }
                else if(req.user.role === "Branch Manager"){
                    res.redirect("/branchManager/home");
                }
                else if(req.user.role === "SOP Team"){
                    res.redirect("/sopTeam/home");
                }
                else if(req.user.role === "Filing Team"){
                    res.redirect("/filingTeam/home");
                }
                else if(req.user.role === "Application Team"){
                    res.redirect("/applicationTeam/home");
                }
                else if(req.user.role === "Interview Team"){
                    res.redirect("/interviewTeam/home");
                }
                 //creates the cookie for the session to allow user to access all pages that requires authentication
            });
        }
    });
}
module.exports.logot_get = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/user/login');
        }
    });
}
// module.exports.enroll_get = async (req, res) => {
//     res.red