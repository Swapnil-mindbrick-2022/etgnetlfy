var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String
}),
adminSchema.virtual('admin', {
    ref: 'admin',
    foreignField: 'user',
    localField: '_id'
})
admin = mongoose.model('admin', adminSchema);

module.exports = admin;