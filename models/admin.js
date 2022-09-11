var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema( {
	
	unique_id: Number,
	name: String,
	username: String,
	password: String,

}),

admin = mongoose.model('admin', adminSchema);

module.exports = admin;

