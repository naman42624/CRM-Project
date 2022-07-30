const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");


// Passport config
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


// Routes
const userRoutes = require("./src/routes/userRoutes");
const telleRoutes = require("./src/routes/telleRoutes");
const counsellorRoutes = require("./src/routes/counsellorRoutes");
const foeRoutes = require("./src/routes/foeRoutes");
const enrolledRoutes = require("./src/routes/enrolledRoutes");
const filingTeamRoutes = require("./src/routes/filingTeamRoutes.js");
const applicationTeamRoutes = require("./src/routes/applicationTeamRoutes");
const sopTeamRoutes = require("./src/routes/sopTeamRoutes");
const interviewTeamRoutes = require("./src/routes/interviewTeamRoutes");
const branchManagerRoutes = require("./src/routes/branchManagerRoutes");

// middlewares
const auth = require("./src/middlewares/auth");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


// TO initialize passport and use session
app.use(passport.initialize());
app.use(passport.session());

connectDB();


app.use("/user", userRoutes);
app.use("/tellecaller", telleRoutes);
app.use("/counsellor", counsellorRoutes);
app.use("/enrolled", enrolledRoutes);
app.use("/foe", foeRoutes);
app.use("/filingTeam", filingTeamRoutes);
app.use("/applicationTeam", applicationTeamRoutes);
app.use("/sopTeam", sopTeamRoutes);
app.use("/interviewTeam", interviewTeamRoutes);
app.use("/branchManager", branchManagerRoutes);

// Respective Dashboard Routes
app.get('/',auth ,(req,res)=>{
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
})

// 403 error page - unauthorized access
app.get("/403", (req, res) => {
    res.render("403");
});

// 404 error page - page not found
app.get("/404", (req, res) => {
    res.render("404");
});

// 500 error page - server error
app.get("/500", (req, res) => {
    res.render("500");
});

app.get("/mail", (req, res) => {
    res.render("verifyTemplate");
});

// app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(3000, function(){
    console.log("Server started on port 3000");
})
