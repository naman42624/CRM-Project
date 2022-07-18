const Lead = require('../models/leadModel');
const academic = require('../models/manageStudent/academic');
const work = require('../models/manageStudent/work');
const test = require('../models/manageStudent/test');
const personal = require('../models/manageStudent/personalInfo');

const enrolledUser = require('../models/manageStudent/enrolledUser');

module.exports.showAllEnrolledUsers = async (req, res) => {
    try {
        const enrolledUsers = await EnrolledUser.find({});
        res.render('enrolledUsers', { enrolledUsers });
    } catch (err) {
        res.send(err);
    }
}


module.exports.enroll_post = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        const user = await enrolledUser.create({
            name: lead.name,
            username: lead.email,
            phone: lead.phone,
            enrollmentDate: new Date(),
            enrolledBy: req.user.id,
        });
        console.log(user);
        await user.save();
        res.redirect('/enrolled/enroll/get/' + user.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}
module.exports.personal_get = async (req, res) => {
    const id = req.params.id;
    console.log("personal");
    try {
        const personalInfo = await personal.findOne({ user: id });
        const academicInfo = await academic.findOne({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const user = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/enroll', { user, personalInfo, academicInfo, workInfo, testInfo });
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
        res.redirect('/enrolled/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.academic_get = async (req, res) => {
    const id = req.params.id;
    console.log("academic");
    try {
        const personalInfo = await personal.findOne({ user: id });
        const academicInfo = await academic.findOne({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const user = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/educational', { user, personalInfo, academicInfo, workInfo, testInfo });
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
            await academic.findOneAndUpdate({ user: req.params.id }, req.body);
        }
        else {
            console.log("else");
            const academicInfo = await academic.create({
                ...req.body,
                user: req.params.id,
            });
            console.log(academicInfo);
            await academicInfo.save();
        }
        res.redirect('/enrolled/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.work_get = async (req, res) => {
    const id = req.params.id;
    console.log("work");
    try {
        const personalInfo = await personal.findOne({ user: id });
        const academicInfo = await academic.findOne({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const user = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/work', { user, personalInfo, academicInfo, workInfo, testInfo });
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
        res.redirect('/enrolled/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

module.exports.test_get = async (req, res) => {
    const id = req.params.id;
    console.log("test");
    try {
        const personalInfo = await personal.findOne({ user: id });
        const academicInfo = await academic.findOne({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const user = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/test', { user, personalInfo, academicInfo, workInfo, testInfo });
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
        res.redirect('/enrolled/enroll/get/' + req.params.id);
        // res.render('enroll', { user });
    } catch (err) {
        res.send(err);
    }
}

// module.exports.submit_post = async (req, res) => {
//     const id = req.params.id;
//     try {
// const personalInfo = await personal.find({ user: id });
// const academicInfo = await academic.find({ user: id });
// const workInfo = await work.find({ user: id });
// const testInfo = await test.find({ user: id });
//         // const user = await enrolledUser.findById(req.params.id);
//         // const name = user.name
//         // const username = user.username
//         // const phone = user.phone
//         // const enrollmentDate = user.enrollmentDate
//         // const enrolledBy = user.enrolledBy
//         const enrolledUser = await enrolledUser.findByIdAndUpdate(req.params.id, {
//             // name: name,
//             // username: username,
//             // phone: phone,
//             // enrollmentDate: enrollmentDate,
//             // enrolledBy: enrolledBy,
//             personalInfo: personalInfo,
//             academicInfo: academicInfo,
//             workInfo: workInfo,
//             testInfo: testInfo,
//             status: "submitted",
//         });
//         res.redirect('/enrolledUser/enroll/get/' + id);
//         // await user.save();
//         // res.redirect('/enrolledUser/enroll/get/'+ user.id);
//         // res.render('enroll', { user });
//     } catch (err) {
//         res.send(err);
//     }
// }


module.exports.enroll_get = async (req, res) => {
    const id = req.params.id;
    // console.log("hi");
    try {
        const personalInfo = await personal.find({ user: id });
        const academicInfo = await academic.find({ user: id });
        const workInfo = await work.find({ user: id });
        const testInfo = await test.find({ user: id });
        const user = await enrolledUser.findById(req.params.id);
        // console.log(user);
        res.render('common/enroll', { user, personalInfo, academicInfo, workInfo, testInfo });
    } catch (err) {
        res.send(err);
    }
}

// module.exports.save_post = async (req, res) => {
//     console.log("hi");
//     try {
//         const user = await enrolledUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.redirect('/enrolledUser/enroll/get/' + user.id);
//     } catch (err) {
//         res.send(err);
//     }
// }

// module.exports.enroll_post = async (req, res) => {
//     try {
//         const lead = await Lead.findById(req.params.id);
//         const user = await enrolledUser.create({
//             name: lead.name,
//             username: lead.email,
//             phone: lead.phone,
//             enrollmentDate: new Date(),
//             enrolledBy: req.user.id,
//         });
//         console.log(user);
//         await user.save();
//         res.redirect('/enrolledUser/enroll/get/'+ user.id);
//         // res.render('enroll', { user });
//     } catch (err) {
//         res.send(err);
//     }
// }


// module.exports.enroll_get = async (req, res) => {
//     const id = req.params.id;
//     console.log("hi");
//     try {
//         const user = await enrolledUser.findById(req.params.id);
//         console.log(user);
//         res.render('enroll', { user });
//     } catch (err) {
//         res.send(err);
//     }
// }

// module.exports.save_post = async (req, res) => {
//     console.log("hi");
//     try {
//         const user = await enrolledUser.findByIdAndUpdate(req.params.id, req.body);
//         res.redirect('/enrolledUser/enroll/get/' + user.id);
//     } catch (err) {
//         res.send(err);
//     }
// }

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
        const lead = await enrolledUser.findById(req.params.id);
        res.render('common/document', { enrolledLead: lead });
    } catch (err) {
        res.send(err);
    }
}

