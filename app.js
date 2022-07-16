const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
// const date = require("./src/config/utilities/date");
// const getGreeting = require("./src/config/utilities/greeting");

// Dates
// const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("en-GB");
// const today = new Date().toLocaleDateString("en-GB");
  
// Models
// const Lead = require("./src/models/leadModel");
// const {User} = require("./src/models/userModel");
// const Task = require("./src/models/task");
// const Tellecaller = require("./src/models/tellecallerModel");
// const {Followup} = require("./src/models/followupModel");
// const Foe = require("./src/models/foe");


// Library for utility functions for general tasks
const _ = require('lodash');

// Passport config
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


// Routes
const userRoutes = require("./src/routes/userRoutes");
const telleRoutes = require("./src/routes/telleRoutes");
const counsellorRoutes = require("./src/routes/counsellorRoutes");

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

const enrolledRoutes = require("./src/routes/enrolledRoutes");


app.use("/user", userRoutes);
app.use("/", telleRoutes);
app.use("/counsellor", counsellorRoutes);
app.use("/enrolled", enrolledRoutes);

// 403 error page - unauthorized access
app.get("/403", (req, res) => {
    res.render("403");
});

// 404 error page - page not found
app.get("/404", (req, res) => {
    res.render("404");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
})
