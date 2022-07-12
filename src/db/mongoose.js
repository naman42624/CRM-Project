const { validate } = require('@mapbox/node-pre-gyp/lib/pre-binding');
const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const url = 'mongodb://localhost:27017/task-manager-api';
mongoose.connect(url);

// const me = new User({
//     name: '    John  ',
//     email: ' NAMAN@GMAIL.COM     ',
//     password: 'passw1234      '
// })

// me.save().then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// })
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Task({
//     description: 'Learn mongoose',
//     completed: false
// }).save().then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// })