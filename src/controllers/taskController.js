const Task = require('../models/task');
const User = require('../models/user');
require('../db/mongoose');
const passport = require('passport')
passport.use(User.createStrategy())
passport.serializeUser((user, done)=>{
    done(null, user.id)
})
passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
        done(err, user)
    })
})

// const assignedByTask = async function(){
//     return await Task.find({assingnedBy: req.user._id}).populate('assingnedTo') 
// }
// const assignedToTask = async function(){ 
//     return await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
// }
module.exports.assignedBy = async (req, res)=>{
    try{
        if(req.isAuthenticated()){
            const tasks = await Task.find({assingnedBy: req.user._id}).populate('assingnedTo')
            res.render('task', {tasks, user: req.user})
        }
        else{
            res.redirect('/')
        }
    }catch(err){
        res.send(err);
    }
}

module.exports.assignedTo = async (req, res)=>{
    try{
        if(req.isAuthenticated()){
            const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
            res.render('task', {tasks, user: req.user})
    }
    else{
        res.redirect('/')
    }
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
        console.log(task)
        await task.save()
        res.redirect('/task-home')
        // res.send(task)
    }catch(err){
        res.send(err);
    }
}
 