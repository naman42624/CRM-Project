const express = require('express')
const router = new express.Router()
const taskController = require('../controllers/taskController')


router.post('/task/create', taskController.createTask)
router.get('/task/assignedBy', taskController.assignedBy)
router.get('/task/assignedTo', taskController.assignedTo)


module.exports = router































// router.post('/task/create', auth ,async (req, res)=>{
//     try{
//         const task = new Task({
//             ...req.body,
//             assingnedBy: req.user._id
//         })
//         await task.save()
//         res.send(task)
//     }catch(err){
//         res.send(err);
//     }
// })

// router.get('/task/assignedBy',auth,async (req, res)=>{
//     try{
//         // const tasks = await Task.find({assingnedBy: req.user._id}).populate('assingnedTo')
//         await req.user.populate('tasks')
//         // console.log(tasks)
//         res.send(req.user.tasks)
//     }catch(err){
//         res.send(err);
//     }
// })

// router.get('/task/assignedTo',auth,async (req, res)=>{
//     try{
//         // const tasks = await Task.find({assingnedTo: req.user._id})
//         const tasks = await Task.find({assingnedTo: req.user._id}).populate('assingnedBy')
//         res.send(tasks)
//         // await req.user.populate('tasks')
//         console.log(tasks)
//         // res.send(req.user.tasks)
//     }catch(err){
//         res.send(err);
//     }
// })



















// router.get('/task/assignedBy/:id',auth,async (req, res)=>{
//     const _id = req.params.id
//     try{
//         // const task = await Task.findById(req.params.id)
//         // const task = await Task.findById(req.params.id).populate('assingnedBy')
//         // const task = await Task.findById(req.params.id).populate('assingnedBy', 'name')
//         const task = await Task.findOne({_id, assingnedBy: req.user._id}).populate('assingnedTo', 'name')
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch(err){  
//         res.send(err);
//     }
// })
// router.get('/task/assignedTo/:id',auth,async (req, res)=>{
//     const _id = req.params.id
//     try{
//         // const task = await Task.findById(req.params.id)
//         // const task = await Task.findById(req.params.id).populate('assingnedBy')
//         // const task = await Task.findById(req.params.id).populate('assingnedBy', 'name')
//         const task = await Task.findOne({_id, assingnedTo: req.user._id}).populate('assingnedBy', 'name')
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch(err){  
//         res.send(err);
//     }
// })
// router.patch('/task/assignedBy/:id',auth ,async (req, res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name','description','completed','assingnedTo','priority', 'dueDate']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }

//     try{
//         const task = await Task.findOne({_id: req.params.id, assingnedBy: req.user._id})
//         updates.forEach((update)=> task[update] = req.body[update])
//         await task.save()
//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)   
//     } catch(e){
//         res.send(e)
//     }
// })

// router.patch('/task/assignedTo/:id', auth ,async (req, res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['completed']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }

//     try{
//         const task = await Task.findOne({_id: req.params.id, assingnedTo: req.user._id})
//         updates.forEach((update)=> task[update] = req.body[update])
//         await task.save()
//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)   
//     } catch(e){
//         res.send(e)
//     }
// })


// router.delete('/task/:id',auth,async (req,res)=>{
//     try{
//         // const task = await Task.findOneAndDelete(req.params.id)
//         const task = await Task.findOneAndDelete({_id: req.params.id, assingnedBy: req.user._id})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch(err){
//         res.status(500).send(err)
//     }
// })

