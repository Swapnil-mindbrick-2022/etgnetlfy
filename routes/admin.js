const moment = require('moment');
const admin = require('../models/admin');
const employee = require('../models/user');
const  path = require('path');


// const multer = require('multer');
const projectrouter = require('./project');
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
let adminLogin = false
//admin -Get Register---
app.get('/admin', function (req, res, next) {
	if (adminLogin == false){
		return res.render('admin/adminregister.ejs');
	}else{
		return res.redirect('/adminlogin')
	}
	
});


// get admin panel route
app.get('/adminpanel', function (req, res, next) {
	if (adminLogin == true){
		employee.find((err,val)=>{
			if(err){
				console.log(err)
			}else{
				return res.render('admin/adminpanel.ejs',{'value':val})
			}
		})
	}else{
		return res.redirect('/adminlogin')
	}
	
})
//Get Admin Controls---
app.get('/admincontrols', function (req, res, next) {
	if (adminLogin == true){
		return res.render('admin/admincontrols.ejs')
	}else{
		return res.redirect('/adminlogin')
	}
})

//Get Add project----
app.get('/addproject', function (req, res, next) {
	if (adminLogin == true){
		project.find({},null,{sort:{'date':1}},(err,projects)=>{	

			if(err){
				console.log(err)
			}else{
				return res.render('admin/addproject.ejs',{'projects':projects})

			}
		})
		

	}else{
		return res.redirect('/adminlogin')
	}
	
})
//Register Login---------
app.post('/admin', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;
	


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf ){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			admin.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var d;
					admin.findOne({},function(err,data){

						if (data) {
							// console.log(data);
							d = data.unique_id + 1;
						}else{
							d=1;
						}

						var newPerson = new admin({
							unique_id:d,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					// req.flash('error','You are registered Successfully!!');
					res.send({'success':'Registered Successfully'});
					// return res.redirect('/adminlogin');
				}else{
					res.send({"Failed":"Email is already In  use."});
				}

			});
		}else{
			res.send({"Failed ":"password does not match"});
		}
	}
	next()
});

app.get('/adminlogin', function (req, res, next) {
	if (adminLogin == false){
		return res.render('admin/adminlogin.ejs');
	}else{
		return res.redirect('/adminlogin')
	}
	
});

app.post('/adminlogin', function (req, res, next) {
	if (adminLogin == false){
		admin.findOne({email:req.body.email},function(err,data){
			if(data){
				
				if(data.password==req.body.password){
					//console.log("Done Login");
					req.session.userId = data.unique_id;
					//console.log(req.session.userId);
					// res.send({"Success":"Success!"});
					adminLogin = true;
					return res.render('admin/admincontrols.ejs');
					
				}else{
					res.send({"Failed":"Wrong password!"});
				}
			}else{
				res.send({"Failed":" Email  not registered!"});
			}});
	}else{
		res.redirect('/admincontrols')
	}
	
	
});

app.get('/adminprofile', function (req, res, next) {
	if (adminLogin == true){
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

	}
	else{
		return res.redirect('/adminlogin')
	};
	
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
app.get('/register', (req,res)=>{
	if (adminLogin == true){
		res.render('employee/index.ejs')
	}
})

//register-----
app.post('/',function(req, res, next) {
	if (adminLogin == true){
	const  personInfo = req.body;
	const person = req.files.awtar

	if(!personInfo.firstName || !personInfo.lastName || !personInfo.designation|| !personInfo.teamLeader  
		||!personInfo.date_of_birth || !personInfo.email||!person ){
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
							awtar:person.mv							
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
}else{
	return res.redirect('/adminlogin');
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
app.delete("/deleteuser/:id", (req, res)=>{
    const unique_id = req.body.unique_id;

    employee.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${unique_id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
})

}

module.exports = adminRoute;