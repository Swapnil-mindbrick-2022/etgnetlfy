const mongoose = require('mongoose');
const Schema = mongoose.Schema;

projectSchema = new Schema( {
    projectName:{
        type:String,
        required: true,
        default:"projectName"
       
        
    },
    
    task: [{
        type:String,
        required: true,
    }],
    date :{ type : Date, default: Date.now }
   
  
})
// projectSchema.virtual('admin', {
//     ref: 'admin',
//     foreignField: 'user',
//     localField: '_id'
// })
project = mongoose.model('project', projectSchema);

module.exports = project;