const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req,res,next)=>{
    console.log('Token- '+req.cookies.jwt)
    try{
        
        // const token = req.header('Authorization').replace('Bearer ','')
        const token = req.cookies.jwt
        console.log(token)
        const decoded = await jwt.verify(token, 'thisismynewcourse')
        console.log(decoded)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        console.log(user)
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send({error: "Please login"})
    }
}
module.exports =  auth