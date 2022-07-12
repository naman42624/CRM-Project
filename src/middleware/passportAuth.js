const initialize= (passport)=> {
    const User = require('../models/user')
    const Strategy = require('passport-local').Strategy
    passport.use(new Strategy(
        async (email, password, cb) => {
            try {
                const user = await User.findByCredentials(email, password)
                cb(null, user)
            } catch (e) {
                cb(e)
            }
        }
    ))
    passport.serializeUser((user, cb) => {
        cb(null, user._id)
    }
    )
    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            if (err) {
                return cb(err)
            }
            cb(null, user)
        })
    }
    )
}
module.exports = initialize
// const initialize = (passport) => {
//     const User = require('../models/user')