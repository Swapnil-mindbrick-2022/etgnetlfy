const User = require('../models/user');
const multer=require('multer');
// let alert = require('alert')
const passport = require('passport')
const project= require('../models/project')
const fetchprojectData = require('../controllers/employee/task')
const userAuth = require('../middleware/user')



function userRoute(app){

//get login
app.get('/', function (req, res, next) {
	return res.render('employee/login.ejs');

});
//get user task
// app.get('/userTask',fetchprojectData().findProjects)

app.get('/userTask',userAuth,fetchprojectData().getprojects)


//get user
app.get('/login', function (req, res, next) {

	return res.render('employee/login.ejs');
	
});
//post login
app.post('/login',passport.authenticate('local',{successRedirect:'/userTask',failureRedirect:'/'}));
//get profile--
app.get('/profile',userAuth,function (req, res, next) {
		User.findOne({_id:req.user.id},function(err,data){
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			return res.redirect('/userTask');
		}
	});	
});
//get Logout---
app.get('/logout',userAuth,function (req, res, next) {
		let pendingTask = req.session.pending

		if (pendingTask  > 0){
			
			res.redirect('/userTask')
		}else{
			req.session.destroy(function (err) {
				if (err) {
					return next(err);
				} else {
					return res.redirect('/');
				}
			});
	}
});

}

module.exports = userRoute;

