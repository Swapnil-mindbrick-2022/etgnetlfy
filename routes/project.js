const project = require('../models/project');
const user = require('../models/user');
const admincontroller = require('../controllers/admin/task')
const taskSchema = require('../models/taskschema')
const taskreport = require('../models/taskreport')
require('./admin')
const multer = require('multer')
const admin = require('../middleware/admin')
const userAuth = require('../middleware/user')
// const {isAuthenticated} = require('../config/passportConfig')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null,'./uploads')  
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage })



const fetchprojectData = require('../controllers/employee/task');
const fetchProjectReport = require('../controllers/employee/reportcontroller');

function projectrouter(app){
    app.post('/project',admin,async (req,res)=>{
        const data = new project({
            projectName:req.body.projectName,
            task:req.body.task
        })
         await data.save();
        res.redirect('/addproject')
    })
    //for deleting project------
    app.delete('/deleteproject',admin,fetchprojectData().deleteProject);

    //for deleting task from master project-------Add project.ejs
    app.post('/deleteTask',admin,admincontroller().deleteaddedTask)
    //getting project by id--
    app.get('/project/:id',admin,fetchprojectData().findProjectById);
    app.get('/addproject/project/',admin,fetchprojectData().getallEmployees);
    //for adding tasks in already created project-----
    app.put('/addtask',admin,fetchprojectData().updateProject);
    app.get('/assignedtask',admin,fetchprojectData().assignedTask);
    app.post('/assignproject',admin,fetchprojectData().assigntask);        //assigning task  to employees
    app.post('/usersession',fetchprojectData().sessionsave)//storing data into session Storage----
    // app.delete('/userTask',fetchprojectData().deleteSessionTask) //deleting task from user's session---


    //task updates from the user's side----
    app.post('/submittask',userAuth, fetchProjectReport().submitProjectData) //posting projectData from employee's side---
    //admin-- get all task by employee--
    app.get('/taskdetails',admin,admincontroller().fetchtaskDetails)

    //active to submit
    app.put('/userTask',userAuth,fetchProjectReport().submitTaskOnTable) //testing

    // delete submited task and project
    app.delete('/userTask/:id',userAuth,fetchProjectReport().deletprojectTask)
    //for uploading-------
    app.post("/userTask/uploadphoto",upload.single('myImage'),fetchProjectReport().postProfile)

    // get user task data

    app.post('/taskHistory',userAuth,fetchProjectReport().taskhistory)

    app.post('/deleteAssignProject',admincontroller().deleteAssignedTask)
    //deleting multiple assigned projects----
    // app.delete('/deleteselected',admincontroller().deleteSelected)
//for updating taskName---
  app.post('/addproject',admincontroller().updateAssignedTask)
}

module.exports = projectrouter
