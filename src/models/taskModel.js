const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;



