const adminRoute = require("../../routes/admin");
const taskreport = require('../../models/taskreport');
const imageModel = require('../../models/profilepic');
const flash = require('connect-flash')

// const moment = require('moment')
//  data fetch from project scheema and user schema 
function fetchprojectData(){

    let pendinglength = 0
    // console.log(pendinglength)

	return{
        async getprojects(req,res){
            let items=null
            imageModel.findOne({uploadedBy:req.user.id},(err,profile)=>{
                if(err){
                    console.log(err)
                }else{
                    items = profile
                    console.log(items)
                }
            })
           
            await taskSchema.find({},(err,taskSchema)=>{
                if (err){
                    console.log(err)
                }else{
                    // finding user userProfile
                    User.findOne({_id:req.user.id},(err,data)=>{
                        if (err){
                            console.log(err)
                        }else{
                            let tasks = []
                            let pendingtask = []
                                if (data){
                                    taskSchema.forEach((task)=>{
                                        if (task.assignedTo == data.username){
                                            tasks.push(task)
                                        }
                                    })
                                    taskreport.find({assignedTo:data.username},(err,myTask)=>{
                                        if(err){
                                            console.log(err)
                                        }else{
                                           let pendingTask = myTask.filter((val)=>{
                                                return val.taskStatus == 'pending'
                                            })
                                            pendingtask = pendingTask
                                                
                                            pendinglength = pendingtask.length
                                                    
                                                
                                                // console.log(getpendingTask())
                                            pendinglength = pendingTask.length
                                            req.session.pending = pendinglength

                                            // console.log(pendinglength)
                                                res.render('employee/userTask.ejs',{'projects':tasks, 'Data':data,
                                                'pendingTask':pendingtask, 
                                                'pendinglength': JSON.stringify(pendinglength),'items':items})
                                        }
                                    })

                                }
                        }
                    })
                }
            })

        },
      
        async deleteProject(req,res){

            await project.deleteOne(
                { projectName: req.body.projectName }
                )
                .then(result => {
                    res.send(`Deleted project successfuly`)
                })
                .catch(error => console.error(error))
        },
        async findProjectById(req,res){

            await project.findById({_id:req.params.id},(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    res.send(data)
                    console.log(data)
                }
                // res.redirect('/getProjects')
            })
        },
        //assigned Task----
        async getallEmployees(req,res){
                await User.find({},(err,emp)=>{
                    if (err){
                        console.log(err)
            
                    }else{
                        // const projectName = req.body.projectName

                        project.find({},(err,data)=>{
                            if (err){
                                res.send(err)
                            }else{
                                User.findOne({_id: req.user.id},(err,adminName)=>{
                                    if (err){
                                        console.log(err)
                                    }else{
                                        taskSchema.find({},(err,assignedtask)=>{
                                            if (err){
                                                console.log(err)
                                            }else{
                                                let employee = emp.filter((val)=>{
                                                    return val.role == 'employee'
                                                })
                                                res.render("admin/maketeam.ejs",{"employees":employee,
                                                "project":data,'assignedBy':adminName,"assignedtask":assignedtask})
                                                // res.send(assignedtask)
                                            }
                                        })
                                        
                                    // res.render("admin/maketeam.ejs",{"employees":employee,"project":data,'assignedBy':adminName})

                                    }
                                })
                            }

                        })
                    }
                })
        },
        async assignedTask(req,res){
            const projectId = await project.findById({_id:req.params.id},(err,data)=>{
                if (err){
                    console.log(err)
                }else{
                    res.send(projectId)
                    console.log(projectId)
                }
            })
        },
        //update task in project-----
        async updateProject(req,res){
            const getProject = await req.body.updateProject
            const tasks = req.body.Task
            let updated;
            tasks.forEach((task)=>{
            updated = project.updateOne(
                    {projectName:req.body.updateProject},
                    {$push: {task: task}},
                    
                ).then(
                    console.log(updated)
                )

            })


                
                 
        },
        //employee task Updates------
        async assigntask(req,res){
            const assign = req.body
            // console.log(assign)
            let emp = assign.employee
            // console.log(typeof(emp))
                // console.log(typeof(emp))

        const chcktyp = typeof(emp)

        // console.log(chcktyp)
        if (chcktyp == 'object'){
            // console.log('yes')
             //for finding if task is assigned to the user or not
             for (let i = 0; i < emp.length;i++){
                taskSchema.findOne(
                    {
                        projectName:{$in : assign.projectName},
                        assignedTo:{$in:emp[i]},
                    },(err,success)=>{
                        if (success){
                            req.flash('error_msg','project already assigned')
                        }else{
                            project.findOne({projectName:assign.projectName},(err,data)=>{
                                if (err){
                                    console.log(err)
                                }else{
                                    const assign = new taskSchema({
                                        projectName:data.projectName,
                                        task: data.task,
                                        assignedTo: emp[i],
                                        taskStatus:'active'
                                    })
                                    assign.save((err,success)=>{
                                        if (err){
                                            console.log(err)
                                        }
                                        // else{
                                        //     console.log(success)
                                        // }
                                    })

                                }
                            })
                        }
                    }

                )
            }
        }else{
             //for finding if task is assigned to the user or not
                taskSchema.findOne(
                    {
                        projectName:{$in : assign.projectName},
                        assignedTo:{$in:emp},
                    },(err,success)=>{
                        if (success){
                            req.flash('error_msg','project already assigned')
                        }else{
                            project.findOne({projectName:assign.projectName},(err,data)=>{
                                if (err){
                                    console.log(err)
                                }else{
                                    const assign = new taskSchema({
                                        projectName:data.projectName,
                                        task: data.task,
                                        assignedTo: emp,
                                        taskStatus:'active'
                                    })
                                    assign.save((err,success)=>{
                                        if (err){
                                            console.log(err)
                                        }
                                        // else{
                                        //     console.log(success)
                                        // }
                                    })

                                }
                            })
                        }
                    }

                )
            








        }

           

},
   
        async sessionsave(req,res){
            let assignTask = req.body
            if (assignTask){
                console.log(assignTask)
                let curTask = {
                    projectName: req.body.projectName,
                    task: req.body.task,
                    timetaken: req.body.timetaken
                }
        
                req.session.assignedTask = curTask
                // res.redirect('/userTask')
                return res.json({task: req.session.assignedTask})
            }
          
},
async deleteSessionTask(req,res){
    let curTask = req.body

    console.log(curTask)

},
// async userLogout(req,res){
//    console.log(pendinglength)
//     // if (pendinglength == 0){
//         res.redirect('/')
//     // }else{
//     //     res.send('please submit your task before logging out')
//     // }
// }

    }      
}

module.exports= fetchprojectData;