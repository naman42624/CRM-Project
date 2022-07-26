const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLenght: 20,
        minLenght: 3,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minLenght: 10,
        trim: true,
        maxLenght: 100
    }, 
    status: {
        type: String,
        default: "Assigned",
    },
    assingnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assingnedTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    dueDate: {
        type: Date,
        default: Date.now,
        required: true
    }
},{timestamps: true})
taskSchema.pre('save', async function(next){
    console.log('Saving Task')
    next()
})
const task = mongoose.model('task', taskSchema)

module.exports = task;



