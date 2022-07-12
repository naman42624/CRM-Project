const User = require('../models/user');
const Task = require('../models/task');
const taskController = require('../controllers/taskController')
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

module.exports.login_get = (req,res)=>{
    res.render('login')
}

module.exports.login_post = async (req,res)=>{
    console.log(req.body)
    try{
        const user = new User(req.body)
        req.login(user, (err)=>{
            if(err){
                res.status('400').send(err)
            }
            else{
                passport.authenticate('local')(req, res, ()=>{
                    res.redirect('/task-home')
                })
            }
        })
    } catch(e){
        res.status(400).send(e)
    }
}

module.exports.register_get = (req, res)=>{
    res.render('register')
}

module.exports.register_post = async (req, res)=>{
    console.log(req.body);
    try{
        const user = new User(req.body)
        User.register(user, req.body.password, (err, user)=>{
            if(err){
                console.log(err)
                return res.status(400).send(err)
            }
            passport.authenticate('local', {
                successRedirect: '/task-home',
                failureRedirect: '/register'
            })(req, res)
        })
    } catch(e){
        res.status('400').send(e)
    }
}

module.exports.logout_post =  async (req,res)=>{
    try{
        if(req.isAuthenticated()){
            req.logout((err)=>{
                if(err){
                    res.status(500).send(err)
                }
                else{
                    res.redirect('/')
                }
            })
        }
    } catch(e){
        res.status(500).send()
    }
}

module.exports.profile_get = async (req, res)=>{
    try{
        if(req.isAuthenticated()){
            const assignedByTask = await Task.find({assingnedBy: req.user._id}).populate('assingnedTo') 
            const assignedToTask = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
            const allUsers = await User.find({})
            res.render('home',{user: req.user, assignedByTask, assignedToTask, allUsers})
        }
        else{
            res.redirect('/')
        }
    } catch(e){
        res.status(500).send(e)
    }
}