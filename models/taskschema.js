const mongoose = require('mongoose');
const Schema = mongoose.Schema;

taskSchema = new Schema( {
    projectName:{
        type:String,
        required:true
    },

    task: [{
        type:String,
        required: true,
    }],
    assignedTo:{
        type: String,
        required: true
    },
    taskStatus: {
        type:String,
        required: true},
        
    date :{ type : Date, default: Date.now }

})

taskSchema = mongoose.model('taskSchema', taskSchema);

module.exports = taskSchema;
