const Lead = require('../models/leadModel');
const academic = require('../models/academic');
const work = require('../models/work');
const test = require('../models/test');
const personal = require('../models/personalInfo');
const {User} = require('../models/userModel');

const enrolledUser = require('../models/enrolledLeadModel');

module.exports.enroll_post = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        const eLead = await enrolledUser.findOne({ lead: req.params.id });
        console.log(lead)
        console.log(eLead)
        
        if (!eLead) {
            const user = await enrolledUser.create({
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                enrollmentDate: new Date(),
                enrolledBy: lead.tellecaller,
                assignedTo: lead.counsellor,
                lead: lead._id,
                branch : lead.branch,
            });
            
            console.log(user);
            await user.save();
            
            const student = new User({
                name: lead.name,
                email: lead.email,
                username: lead.email,
                phone: lead.phone,
                enrolledLead: user._id,
                role: "Student",
                branch : lead.branch,
                isVerified: true,
            })
        
            // user.avatar = sharp(Buffer.from("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp")).resize({width: 250, height: 250}).png().toBuffer();
            // user.avatar.contentType = "image/webp";
            console.log(student);
            let password = "Bells@"+lead.name;
            User.register(student, password, function(err, user,){
                if(err){
                    console.log(err);
                    res.redirect("/user/register");
                }
                else{
                    console.log("User registered");
                }
            })
            res.redirect('/enrolled/save/personal/' + user.id);
        }
        else {
            res.redirect('/enrolled/save/personal/' + eLead._id);
        }
    } catch (err) {
       console.log(err);
       res.redirect("/500");
    }
}


module.exports.personal_post = async (req, res) => {
    try {
        const personalO = await personal.findOne({ enrolledLead: req.params.id });
        console.log(personalO);
        if (personalO) {
            await personal.findOneAndUpdate({ enrolledLead: req.params.id }, req.body)
        }
        else {
            const personalInfo = await personal.create({
                ...req.body,
                enrolledLead: req.params.id,
            });
            console.log(personalInfo);
            await personalInfo.save();
        }
        res.redirect('/enrolled/save/personal/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.academic_get = async (req, res) => {
    const id = req.params.id;
    const user =req.user;
    console.log("academic");
    try {
        const academicInfoO = await academic.findOne({ enrolledLead: id });
        if(academicInfoO){
            const academicInfo = await academic.findOne({ enrolledLead: id });
            const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('enrolled/individual/educational', { academicInfo, enrolledLead, user });
        }
        else{
            const academicInfo = []
            const enrolledLead = await enrolledUser.findById(req.params.id);
            res.render('enrolled/individual/educational', { academicInfo, enrolledLead, user });
        }
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.academic_post = async (req, res) => {
    try {
        console.log("hi");
        const academicO = await academic.findOne({ enrolledLead: req.params.id });
        console.log(academicO);
        if (academicO) {
            console.log("if")
            await academic.findOneAndUpdate({ enrolledLead: req.params.id }, req.body);
        }
        else {
            console.log("else");
            const academicInfo = await academic.create({
                ...req.body,
                enrolledLead: req.params.id,
            });
            console.log(academicInfo);
            await academicInfo.save();
        }
        res.redirect('/enrolled/save/academic/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.work_get = async (req, res) => {
    const id = req.params.id;
    const user =req.user;
    console.log("work");
    try {
        const workInfo = await work.find({enrolledLead : id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        console.log(workInfo);
        res.render('enrolled/individual/work', { enrolledLead, workInfo, user });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.work_post = async (req, res) => {
    try {
        const workInfo = await work.create({
            ...req.body,
            enrolledLead: req.params.id,
        });
        console.log(workInfo);
        await workInfo.save();
        res.redirect('/enrolled/save/work/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.work_update = async (req, res) => {
    try {
        console.log("hi");
        const workInfo = await work.findById(req.params.workId);
        const enrolledLead = await enrolledUser.findById(req.params.enrolledId);
        console.log(workInfo);
        await workInfo.updateOne(req.body);
        res.redirect('/enrolled/save/work/' + req.params.enrolledId);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_update = async (req, res) => {
    try {
        console.log("hi");
        const testInfo = await test.findById(req.params.testId);
        const enrolledLead = await enrolledUser.findById(req.params.enrolledId);
        console.log(testInfo);
        await testInfo.updateOne(req.body);
        res.redirect('/enrolled/save/test/' + req.params.enrolledId);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}


module.exports.test_get = async (req, res) => {
    const id = req.params.id;
    const user =req.user;
    console.log("test");
    try {
        const testInfo = await test.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('enrolled/individual/test', { enrolledLead, testInfo , user});
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.test_post = async (req, res) => {
    try {
        const testInfo = await test.create({
            ...req.body,
            enrolledLead: req.params.id,
        });
        console.log(testInfo);
        await testInfo.save();
        res.redirect('/enrolled/save/personal/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}

module.exports.enroll_get = async (req, res) => {
    // console.log("hi");
    try {
        const id = req.params.id;
        const user =req.user;
        const personalInfoO = await personal.findOne({ enrolledLead: id });
        if(personalInfoO){
            console.log("if")
            const personalInfo = await personal.findOne({ enrolledLead: id });
            const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
            res.render('enrolled/individual/profile', { enrolledLead, personalInfo, user });
        } else{
            console.log("else")
            const personalInfo = []
            const enrolledLead = await enrolledUser.findById(req.params.id);
            res.render('enrolled/individual/profile', { enrolledLead, personalInfo, user });
        }
    } catch (err) {
        console.log(err);
        res.redirect("/500");
    }
}


