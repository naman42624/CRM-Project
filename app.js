const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");

// Library for utility functions for general tasks
const _ = require('lodash');

// Passport config
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const auth = require('./src/middlewares/auth')

// Routes
const userRoutes = require("./src/routes/userRoutes");
const telleRoutes = require("./src/routes/telleRoutes");
const enrolledRoutes = require("./src/routes/enrolledRoutes");
const counsellorRoutes = require("./src/routes/counsellorRoutes")
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
// app.use(passport.authenticate('local'));



connectDB();

app.use("/user", userRoutes);
app.use("/", telleRoutes);
app.use("/enrolled", enrolledRoutes);
app.use('/' , counsellorRoutes)
app.get('/',auth ,(req,res)=>{
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
})
// app.get("*", function(req, res){
//     res.redirect("/");
// })
app.listen(3000, function(){
    console.log("Server started on port 3000");
})
