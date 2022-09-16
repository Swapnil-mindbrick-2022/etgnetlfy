const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	firstName: {
		type: String,
	},
	lastName: {
		type: String
	},
	designation: {
		type: String,
	},
	teamLeader: {
		type: String,
	},
	username:{
		type: String,

	},
	date_of_birth:{
		type : String,
	},
	email: String,
	password: String,
	role:String,
	
	lastLogin : { type : Date, default: Date.now }
})


User = mongoose.model('User', userSchema);

module.exports = User;