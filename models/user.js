var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	designation: {
		type: String,
		required: true
	},
	teamLeader: {
		type: String,
		required: true
	},
	username:{
		type: String,
		required: true

	},
	date_of_birth:{
		type : String,
		required: true
	},
	email: String,
	password: String,
	
	img:String,
	
	lastLogin : { type : Date, default: Date.now }
})
User = mongoose.model('User', userSchema);

module.exports = User;