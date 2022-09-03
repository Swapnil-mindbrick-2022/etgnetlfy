const project = require('../models/project');
const moment = require('moment');
const admin = require('../models/admin');
const admincontroller = require('../controllers/admin/task')
const taskSchema = require('../models/taskschema')
const taskreport = require('../models/taskreport')

require('./admin')

const fetchprojectData = require('../controllers/employee/task');
const fetchProjectReport = require('../controllers/employee/reportcontroller');

function projectrouter(app){
    app.post('/project',async (req,res)=>{
        const data = new project({
            projectName:req.body.projectName,
            task:req.body.task
        });
        const val = await data.save();
        res.redirect('/addproject')
    })
    //for deleting project------
    app.delete('/deleteproject',fetchprojectData().deleteProject);
    //getting project by id--
    app.get('/project/:id',fetchprojectData().findProjectById);
    app.post('/addproject/project/',fetchprojectData().getallEmployees);
    app.put('/project',fetchprojectData().updateProject)
    app.get('/assignedtask',fetchprojectData().assignedTask);
    app.post('/assignproject',fetchprojectData().assigntask);        //assigning task  to employees
    app.post('/usersession',fetchprojectData().sessionsave)//storing data into session Storage----
    // app.delete('/userTask',fetchprojectData().deleteSessionTask) //deleting task from user's session---


    //task updates from the user's side----
    app.post('/submittask', fetchProjectReport().submitProjectData) //posting projectData from employee's side---
    //admin-- get all task by employee--
    app.get('/taskdetails',admincontroller().fetchtaskDetails)

    //active to submit
    app.put('/userTask',fetchProjectReport().submitTaskOnTable) //testing

    // delete submited task and project
    app.delete('/userTask/:id',fetchProjectReport().deletprojectTask)
    
}

module.exports = projectrouter
