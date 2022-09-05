const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var imageSchema = new Schema({
  
    img:
    {
        // data: Buffer,
        // contentType: String
        type: String,
        required: true,
    },
    uploadedBy:{
        type: String,
        required: true,
        default: 'user'
    
    }

});
 
//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model('Image', imageSchema);
