const mongoose = require('mongoose');
const Schema = mongoose.Schema;

taskReportSchema = new Schema( {
    projectName:{
        type:String,
        default: 'project',
        required:true
    },

    task: {
        type:String,
        required: true,
    },
    assignedTo:{
        type: String,
        required: true
    },
    timetaken: {
        type:String,
    },
    teamleader:{
        type:String,
        required: true
    },
    taskStatus:{
        type: String,
        default: 'pending',
        required: true
    },

    date:{
        type: String,
        required:true
        
    }

})

taskreport = mongoose.model('taskreport', taskReportSchema);

module.exports = taskreport;
