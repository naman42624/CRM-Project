const express = require('express');
const router = new express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.login_get)
router.post('/', userController.login_post)
router.get('/register', userController.register_get)
router.post('/register', userController.register_post)
router.post('/logout', userController.logout_post)
router.get('/task-home', userController.profile_get)

module.exports = router

































// router.get('/profile/:id', )
// router.get('/profile/:id/edit', )
// router.post('/profile/:id/edit', )
// router.get('/profile/:id/delete', )
// router.post('/profile/:id/delete', )
// router.get('/profile/:id/tasks', )
// router.get('/profile/:id/tasks/:taskId', )
// router.get('/profile/:id/tasks/:taskId/edit', )
// router.post('/profile/:id/tasks/:taskId/edit', )
// router.get('/profile/:id/tasks/:taskId/delete', )
// router.post('/profile/:id/tasks/:taskId/delete', )
// router.get('/profile/:id/tasks/:taskId/complete', )
// router.post('/profile/:id/tasks/:taskId/complete', )
// router.get('/profile/:id/tasks/:taskId/uncomplete', )
// router.post('/profile/:id/tasks/:taskId/uncomplete', )
// router.get('/profile/:id/tasks/:taskId/assign', )
// router.post('/profile/:id/tasks/:taskId/assign', )
// router.get('/profile/:id/tasks/:taskId/unassign', )
// router.post('/profile/:id/tasks/:taskId/unassign', )
// router.get('/profile/:id/tasks/:taskId/complete', )
// router.post('/profile/:id/tasks/:taskId/complete', )
// router.get('/profile/:id/tasks/:taskId/uncomplete', )
// router.post('/profile/:id/tasks/:taskId/uncomplete', )
// router.get('/profile/:id/tasks/:taskId/assign', )







// router.get('/register', (req, res)=>{
//     res.render('register')
// })
// router.post ('/register',async (req, res)=>{
//     // res.send(req.body);
//     console.log(req.body);
//     try{
//         const user = new User(req.body)
//         User.register(user, req.body.password, (err, user)=>{
//             if(err){
//                 console.log(err)
//                 return res.status(400).send(err)
//             }
//             passport.authenticate('local', {
//                 successRedirect: '/users/me',
//                 failureRedirect: '/register'
//             })(req, res)
//         }
//         )


//         // await user.save()

//         // const token = await user.generateAuthToken()
//         // res.cookie('jwt', token,{
//         //     httpOnly: true,
//         //     maxAge: 1000 * 60 * 60 * 24 * 7
//         // }) 
//         // res.send({user,token})

//         // res.send(user)
//     }catch(e){
//         res.status('400').send(e)
//     }
// })
// router.get('/', (req,res)=>{
//     res.render('login')
// })
// router.post('/', async (req,res)=>{
//     console.log(req.body)
//     try{
//         // const user = await User.findByCredentials(req.body.email, req.body.password)
//         // const token = await user.generateAuthToken()
//         // res.cookie('jwt', token,{
//         //     httpOnly: true,
//         //     maxAge: 1000 * 60 * 60 * 24 * 7
//         // }) 
//         // console.log(token)
//         // // res.headers.Autherization = 'Bearer '+token
//         // res.redirect('/users/me')
//         // // res.send({user ,token})
//         // // res.send(user)
//         const user = new User(req.body)
//         req.login(user, (err)=>{
//             if(err){
//                 res.status('400').send(err)
//             }
//             else{
//                 passport.authenticate('local')(req, res, ()=>{
//                     res.redirect('/users/me')
//                 })
//             }
//             // res.redirect('/users/me')
//         })
//     } catch(e){
//         res.status(400).send(e)
//     }
// })

// router.post('/users/logout', async (req,res)=>{
//     // try{
//     //     req.user.tokens = req.user.tokens.filter((token)=>{
//     //         return token.token !== req.token
//     //     })
//     //     await req.user.save()
//     //     res.send()
//     // } catch(e){
//     //     res.status(500).send()
//     // }
//     try{
//         if(req.isAuthenticated()){
//             req.logout((err)=>{
//                 if(err){
//                     res.status(500).send(err)
//                 }
//                 else{
//                     res.redirect('/')
//                 }
//             })
//         }
//     } catch(e){
//         res.status(500).send()
//     }
// })

// router.post('/users/logoutAll', auth, async (req,res)=>{
//     try{
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     } catch(e){
//         res.status(500).send()
//     }
// })

// router.get('/users/me' ,async (req, res)=>{
//     // try{
//     //     const users = await User.find({})
//     //     res.send(users)
//     //     console.log(users)
//     // }catch(e){
//     //     res.status(400).send(e)
//     // }
//     // console.log(req.headers)
//     // const task = await 
//     if(req.isAuthenticated()){
//         res.render('home',{user: req.user})
//     }
//     else{
//         res.redirect('/')
//     }
// })
// to use later
// router.get('/users/:id',async (req, res)=>{
//     try{
//         const user = await User.findById(req.params.id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(err){  
//         console.log(err);
//     }
//     // console.log(req.params);
// })



// router.patch('/users/me', async (req, res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'age']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({error: 'Invalid updates!'})
//     }

//     try{
//         // const user = await User.findById(req.params.id)
//         const user = req.user
//         updates.forEach((update)=> user[update] = req.body[update])
//         await user.save()
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
//         res.send(user)   
//     } catch(e){
//         res.send(e)
//     }
// })

// router.delete('/users/me' ,async (req,res)=>{
//     try{
//         // const user = await User.findByIdAndDelete(req.user._id)
//         // if(!user){
//         //     return res.status(404).send()
//         // }
//         await req.user.remove()
//         res.send(req.user)
//     } catch(err){
//         res.send(err)
//     }

// })


