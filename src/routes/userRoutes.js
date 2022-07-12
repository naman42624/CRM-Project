const express = require("express");
const router = express.Router();
const {User} = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");
const sharp = require("sharp");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/avatarUpload");


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

router.get("/register", function(req, res){
    res.render("register");
});

router.get("/login", function(req, res){
    res.render("login");
});

// User Profile Page
router.get("/profile", function(req, res){
    // console.log(req.user);
    // console.log(req.session);
    // console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        User.findById(req.user._id, function(err, user){
            if(err){
                console.log(err);
            } else {
                const avatarSrc = "data:image/png;base64," + user.avatar.toString("base64");
                res.render("profile", {avatarSrc: avatarSrc, user: user, date: date.newDateTopBar(), greeting: getGreeting()});
            }
        })
    }
    else{
        res.redirect("/user/login");
    }
});

router.post("/register" , function(req, res){
    console.log(req.body);
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.username,
        address: req.body.address,
        phone: req.body.phone,
        role: req.body.role,
        isVerified: false,
        isTellecaller: false,
        isCounsellor: false,
        isAdmin: false,
        isFoe: false
    });
    if(req.body.role === "admin"){
        user.isAdmin = true;
    }
    if(req.body.role === "counsellor"){
        user.isCounsellor = true;
    }
    if(req.body.role === "tellecaller"){
        user.isTellecaller = true;
    }
    if(req.body.role === "foe"){
        user.isFoe = true;
    }
    console.log(user);
    
    User.register(user, req.body.password, function(err, user,){
        if(err){
            console.log(err);
            res.redirect("/user/register");
        }
        else{
            console.log("User registered");
            passport.authenticate("local")(req, res, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("User logged in");
                res.redirect("/");
                }
            });
        }
    })
});



router.post("/uploadAvatar", auth ,upload.single("avatar"), async function(req, res){
    console.log(req.file);
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    req.user.avatar.contentType = req.file.mimetype;
    await req.user.save();
    res.redirect("/user/profile");
},(error, req, res, next)=>{
    res.status(400).send({error: error.message});
}
);

router.delete("/deleteAvatar", auth, async function(req, res){
    try{
        req.user.avatar = await sharp(new Buffer.from("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp")).resize({width: 250, height: 250}).png().toBuffer();
        await req.user.save();
        res.redirect("/user/profile");
    }
    catch(err){
        res.status(500).send(err);
    }
}
);

router.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("User logged in");
            passport.authenticate("local")(req, res, function(){ // this middleware invokes req.login() to login the newly registered automatically and also creates the cookie with the session
                res.redirect("/"); //creates the cookie for the session to allow user to access all pages that requires authentication
            });
        }
    });
});

router.get('/logout', function(req, res){
    req.logout(function(err) {
        if (err) {
            console.log(err); 
        }else{
            res.redirect('/user/login');
        }
      });
});

module.exports = router;