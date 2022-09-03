const User = require('../models/user');
const multer=require('multer');
let alert = require('alert')
const notifier = require('node-notifier')
const project= require('../models/project')
const fetchprojectData = require('../controllers/employee/task')


function userRoute(app){
let userLogin = false;
//get login
app.get('/', function (req, res, next) {
	if(userLogin==false){
		return res.render('employee/login.ejs');

	}
	else {
		res.redirect('/userTask')

	}
});
//get user task
// app.get('/userTask',fetchprojectData().findProjects)

	app.get('/userTask',fetchprojectData().getprojects)




//get user
app.get('/login', function (req, res, next) {
	if (userLogin==false){
		return res.render('employee/login.ejs');
	}else{
		res.redirect('/userTask')
	}
	
});
//post login
app.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id

				User.findOneAndUpdate({username:req.username},{lastLogin: Date.now() },(err,data)=>{
					if (err){
						console.log('time not updated')
						res.send({"Success":"Success!"});
						userLogin = true

					}else{
						console.log(data,'time updated successfully')
						res.send({"Success":"Success!"});
						userLogin = true
					}
				})
			}else{
				res.send({"Failed":"Wrong password!"});
				userLogin = false
			}
		}else{
			res.send({"Failed":" Email  not registered !"});
		}
	});
});
//get profile--
app.get('/profile', function (req, res, next) {
	if(userLogin==true){
		console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			// return res.render('data.ejs', {"name":data.firstName + data.lastname,"email":data.email});
			return res.redirect('/userTask');
		}
	});

	}else{
		res.render('employee/login.ejs');
	}
	
});
//get Logout---
app.get('/logout', function (req, res, next) {
	if(userLogin==true){
		let pendingTask = req.session.pending

		if (pendingTask  > 0){
			alert('Please Submit Your Task Before Logging Out')
			res.redirect('/userTask')
		}else{
			req.session.destroy(function (err) {
				if (err) {
					return next(err);
				} else {
					userLogin = false
					return res.redirect('/');
				}
			});
		}
	}
	else{
		res.redirect('/');
	}
    // delete session object
   

});

}
module.exports = userRoute;