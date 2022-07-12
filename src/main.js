const express = require('express');
const app = express();
require('./db/mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const session = require('express-session')
// app.use((req,res,next)=>{
//     console.log(req.method, req.path)
//     res.status('503').send('Currently Under Maintainence')
    
// })

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static('/Users/namanbhatia/Desktop/Work/node/task/public'))

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'thisismynewcourse',
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app.use(userRouter)
app.use(taskRouter)

const path = require('path')

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
// const bcrypt = require('bcryptjs')
// const myFunction =async ()=>{
//     const password = 'Naman1234'
//     const hashedPassword = await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashedPassword)
// }
// myFunction()




const Task = require('../src/models/task')
const User = require('../src/models/user')
// const main = async ()=>{
//     // const task = await Task.findById('62c952149496f80364642af5')
//     // await task.populate('assingnedBy')
//     // console.log(task.assingnedBy)
//     const user = await User.findById('62c9517a9496f80364642ae9')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main() 






















// app.get('/users',(req, res)=>{
//     User.find({}).then((result)=>{
//         res.send(result);
//     }).catch((err)=>{
//         console.log(err);
//     })
// })

// app.get('/users/:id',(req, res)=>{
//     User.findById(req.params.id).then((result)=>{
//         if(!result){
//             return res.status(404).send();
//         }
//         res.send(result);
//     }).catch((err)=>{  
//         console.log(err);
//     })
//     // console.log(req.params);
// })

// app.post('/task',(req, res)=>{
//     res.send(req.body);
//     console.log(req.body);
//     new task(req.body).save().then((result)=>{
//         console.log(result);
//     }).catch((err)=>{
//         console.log(err);
//     })
// })

// app.get('/task',(req, res)=>{
//     task.find({}).then((result)=>{
//         res.send(result);
//     }).catch((err)=>{
//         console.log(err);
//     })
// })

// app.get('/task/:id',(req, res)=>{
//     task.findById(req.params.id).then((result)=>{
//         if(!result){
//             return res.status(404).send();
//         }
//         res.send(result);
//     }).catch((err)=>{  
//         console.log(err);
//     })
//     // console.log(req.params);
// })


// app.patch('task/:id',async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }
//     try{
//         const task = await Task.findByIdAndUpdate(req.body.id, req.body,{new:true, runValidators:true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch(err){
//         res.send(err)
//     }
// })
