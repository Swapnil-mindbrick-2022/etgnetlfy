const moment = require('moment');
const admin = require('../models/admin');
const employee = require('../models/user');
const  path = require('path');


// const multer = require('multer');
const projectrouter = require('./project');
const passport = require('passport');
const { isAuthenticated } = require('../config/passportConfig');
// const storage = multer.diskStorage({
// 	destination: function(req, file, callback) {
// 	  callback(null,path.join(__dirname,'../uploads/'))
// 	},
// 	filename: function (req, file, callback) {
// 		callback(null, new Date().getTime() + file.originalname);
// 	}
//   });
//   const upload = multer({
// 	storage:storage
//   }).single("awtar")

function adminRoute(app){

//admin -Get Register---
app.get('/admin', function (req, res, next) {
	return res.render('admin/adminregister.ejs');
	
});


// get admin panel route
app.get('/adminpanel', isAuthenticated,function (req, res, next) {
		employee.find((err,val)=>{
			if(err){
				console.log(err)
			}else{
				return res.render('admin/adminpanel.ejs',{'value':val})
			}
		})
})
//Get Admin Controls---
app.get('/admincontrols',isAuthenticated,function (req, res, next) {
	return res.render('admin/admincontrols.ejs')
})

//Get Add project----
app.get('/addproject',isAuthenticated, function (req, res, next) {

	project.find({},null,{sort:{'date':1}},(err,projects)=>{	

		if(err){
			console.log(err)
		}else{
			return res.render('admin/addproject.ejs',{'projects':projects})

		}
	})
})
//Register Login---------
app.post('/admin', function(req, res, next) {
	console.log(req.body);
	const personInfo = req.body;


	if(!personInfo.name || !personInfo.username || !personInfo.password || !personInfo.password){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			admin.findOne({username:personInfo.username},function(err,data){
				if(!data){
					var c;
					admin.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new admin({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

app.get('/adminlogin', function (req, res, next) {
	
	return res.render('admin/adminlogin.ejs');
	
});
//post login admin----
app.post('/adminlogin',passport.authenticate('local',{failureRedirect:'/adminlogin',successRedirect:'/admincontrols'}));
	
app.get('/adminprofile', function (req, res, next) {

		User.findOne({unique_id:req.session.userId},function(err,data){
			console.log("data");
			console.log(data);
			if(!data){
				res.redirect('/admin');
			}else{
				//console.log("found");
				return res.render('admin/admindata.ejs', {"name":data.username,"email":data.email});
			}
		});
});

app.get('/adminlogout', function (req, res, next) {
	
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
			adminLogin = false
    		return res.redirect('/adminlogin');
    	}
    });
}
});
//forgot admin pswrd----
app.get('/adminforgetpass', function (req, res, next) {
	res.render("admin/adminforgetadminpass.ejs");
});

app.post('/adminforgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"failed":" Email  not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Failed":"Password does not match! Both Password should be same."});
		}
		}
	});
	
});

//employee register--------
app.get('/register',isAuthenticated,(req,res)=>{
	res.render('employee/index.ejs')
})

//register-----
app.post('/',isAuthenticated,function(req, res, next) {
	const  personInfo = req.body;
	// const person = req.files.awtar

	if(!personInfo.firstName || !personInfo.lastName || !personInfo.designation|| !personInfo.teamLeader  
		||!personInfo.date_of_birth || !personInfo.email){
		res.send();
	} else {
		employee.findOne({email:personInfo.email},function(err,data){
				if(!data){
					let dobpswrd = personInfo.date_of_birth.substring(5,7) + personInfo.date_of_birth.substring(8,10);
					//for Password-----
					let Password = personInfo.firstName.charAt(0).toUpperCase() + personInfo.lastName.charAt(0).toUpperCase()
					 + '@' + dobpswrd;
					
					
					//for userName----------
					let dob = personInfo.date_of_birth.substring(0,4);
					let userName;
						userName = personInfo.firstName.charAt(0).toUpperCase() + personInfo.firstName.substring(1,4) + dob
					var c; 
					employee.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}
						var newPerson = new User({
							unique_id:c,
							firstName:personInfo.firstName,
							lastName:personInfo.lastName,
							designation: personInfo.designation,
							teamLeader: personInfo.teamLeader,
							username: userName,
							date_of_birth:personInfo.date_of_birth,
							email:personInfo.email,
							password: Password,
							// awtar:person.mv							
						});
						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Failed":"Email is already used."});
				}

			});
	}

});
// Update a new idetified user by user id
app.put('/updateuser/:id',(req,res)=>{
	if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
	const id = req.body._id;
    employee.findByIdAndUpdate(_id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                // res.send(data)
				res.render("update_user", { user : userdata.data})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })

	

})	

// Delete a user with specified user id in the request
app.delete('/deleteuser/:id',isAuthenticated,  (req,res)=>{
	User.findByIdAndRemove(req.params.id,(err)=>{
		if (err){
			res.redirect('/adminpanel')
		}else{
			res.redirect('/adminpanel')
		}
	})
	

	
})

}

module.exports = adminRoute;