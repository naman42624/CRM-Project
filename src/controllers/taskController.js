const Task = require("../models/taskModel");
const {User} = require("../models/userModel");
const date = require("../config/utilities/date");
const getGreeting = require("../config/utilities/greeting");
const { sendTaskEmail } = require("../config/sendEmail");

module.exports.assignedBy = async (req, res)=>{
    try{
            const avatarSrc = "data:image/png;base64," + req.user.avatar.toString("base64");
            const tasks = await Task.find({assingnedBy: req.user._id}).populate('assingnedTo assingnedBy')
            // console.log(tasks)
            const allUsers = await User.find({})
            res.render('task', {avatarSrc, date: date.newDateTopBar(), greeting: getGreeting(), tasks, user: req.user, allUsers, person: 'assignedBy'})
    }catch(err){
        res.send(err);
    }
}

module.exports.assignedTo = async (req, res)=>{
    try{
            const avatarSrc = "data:image/png;base64," + req.user.avatar.toString("base64");
            const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy assingnedTo')
            // console.log(tasks)
            const allUsers = await User.find({})
            res.render('task', {avatarSrc: avatarSrc, date: date.newDateTopBar(), greeting: getGreeting(), tasks, user: req.user, allUsers, person: 'assignedTo'});
    }catch(err){
        res.send(err);
    }
}

module.exports.createTask = async (req, res)=>{
    try{
        const task = new Task({
            ...req.body,
            assingnedBy: req.user._id,
        })
        // console.log(task)
        await task.save();
        const newTask = await Task.findById(task._id).populate('assingnedBy assingnedTo');
        sendTaskEmail(req.user, newTask.assingnedTo, newTask);
        res.redirect('/user/task')
        // res.send(task)
    }catch(err){
        res.send(err);
    }
}

module.exports.updateTask = async (req, res)=>{
    try{
        const task = await Task.findById(req.params.id)
        // console.log(task)
        await task.updateOne(req.body)
        res.redirect('/user/task')
        // res.send(task)
    }catch(err){
        res.send(err);
    }
}
 