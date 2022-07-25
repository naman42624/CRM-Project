const Lead = require('../models/leadModel');
const academic = require('../models/academic');
const work = require('../models/work');
const test = require('../models/test');
const personal = require('../models/personalInfo');

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
                enrolledBy: req.user.id,
                lead: lead._id
            });
            console.log(user);
            await user.save();
            res.redirect('/enrolled/get/' + user.id);
        }
        else {
            res.redirect('/enrolled/get/' + eLead._id);
        }
    } catch (err) {
        res.send(err);
    }
}


module.exports.personal_post = async (req, res) => {
    try {
        const personalO = await personal.findOne({ user: req.params.id });
        console.log(personalO);
        if (personalO) {
            await personal.findOneAndUpdate({ user: req.params.id }, req.body)
        }
        else {
            const personalInfo = await personal.create({
                ...req.body,
                user: req.params.id,
            });
            console.log(personalInfo);
            await personalInfo.save();
        }
        res.redirect('/enrolledUser/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.academic_get = async (req, res) => {
    const id = req.params.id;
    console.log("academic");
    try {
        const academicInfo = await academic.findOne({ enrolledLead: id });
        if(academicInfo){
        const enrolledLead = await enrolledUser.findById(req.params.id);
        res.render('enrolled/individual/educational', { academicInfo, enrolledLead });
        }
        else{
            const academicInfo = []
            const enrolledLead = await enrolledUser.findById(req.params.id);
            res.render('enrolled/individual/educational', { academicInfo, enrolledLead });
        }
    } catch (err) {
        res.send(err);
    }
}

module.exports.academic_post = async (req, res) => {
    try {
        console.log("hi");
        const academicO = await academic.findOne({ user: req.params.id });
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
        res.send(err);
    }
}

module.exports.work_get = async (req, res) => {
    const id = req.params.id;
    console.log("work");
    try {
        const workInfo = await work.find({enrolledLead : id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('enrolled/individual/work', { enrolledLead, workInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.work_post = async (req, res) => {
    try {
        const workO = await work.find({ user: req.params.id });
        console.log(workO);
        if (workO) {
            await work.findOneAndUpdate({ user: req.params.id }, req.body);
        }
        else {
        const workInfo = await work.create({
            ...req.body,
            user: req.params.id,
        });
        console.log(workInfo);
        await workInfo.save();
        }
        res.redirect('/enrolledUser/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_get = async (req, res) => {
    const id = req.params.id;
    console.log("test");
    try {
        const testInfo = await test.find({ user: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('enrolled/individual/test', { enrolledLead, testInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_post = async (req, res) => {
    try {
        const testInfo = await test.create({
            ...req.body,
            user: req.params.id,
        });
        console.log(testInfo);
        await testInfo.save();
        res.redirect('/enrolledUser/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.enroll_get = async (req, res) => {
    const id = req.params.id;
    // console.log("hi");
    try {
        const personalInfo = await personal.find({ enrolledLead: id });
        const enrolledLead = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('enrolled/individual/profile', { enrolledLead, personalInfo });
    } catch (err) {
        res.send(err);
    }
}

module.exports.profile = async (req, res) => {
    try {
        const user = await enrolledUser.findById(req.params.id);
        res.render('profile', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.document = async (req, res) => {
    try {
        const user = await enrolledUser.findById(req.params.id);
        res.render('document', { user });
    } catch (err) {
        res.send(err);
    }
}

