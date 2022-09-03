const adminRoute = require("../../routes/admin");
const taskreport = require('../../models/taskreport');
// const moment = require('moment')
//  data fetch from project scheema and user schema 
function fetchprojectData(){
    let pendinglength = 0
    // console.log(pendinglength)

	return{
        async getprojects(req,res){
            // let userLogin = false
            //for assigned task
            await taskSchema.find({},(err,taskSchema)=>{
                if (err){
                    console.log(err)
                }else{
                    // finding user userProfile
                    User.findOne({unique_id:req.session.userId},(err,data)=>{
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
                                                'pendingTask':pendingtask})
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
                await User.find({},(err,employee)=>{
                    if (err){
                        console.log(err)
            
                    }else{
                        const projectName = req.body.projectName

                        project.findOne({projectName: projectName},(err,data)=>{
                            if (err){
                                res.send(err)
                            }else{
                                admin.findOne({unique_id: req.session.userId},(err,adminName)=>{
                                    if (err){
                                        console.log(err)
                                    }else{
                                        console.log(adminName)
                                    res.render("admin/maketeam.ejs",{"employees":employee,"project":data,'assignedBy':adminName})

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
            const tasks = req.body.taskUpdate
            // project.findOne({projectName:getProject},(err,projects)=>{
            //     if (err){
            //         console.log(err)
            //     }else{
            //         projects.task.forEach((ele)=>{
            //             ele.findOne({tasks},(err,tasks)=>{
            //                 if (err){
            //                     console.log(err)
            //                 }else{
            //                     console.log(tasks)
            //                     res.redirect('/addProject')
            //                 }
            //             })
            //         })
            //     }
            // })

            if (getProject){
                await project.findOneAndUpdate(
                    {projectName:getProject},
                    {$push: {task: req.body.taskUpdate}},
                    function (err,success){
                        if(err){
                            console.log(err)
                        }else{
                            console.log(success)
                            // res.send('success')
                            res.redirect('/addproject')
                        }
                    }
                )
            }            
        },
        //employee task Updates------
        async taskupdates(req,res){
            const gettask = await req.body
            res.send(gettask)
        },
//assigning task---------
// async assigntask(req,res){
//     const getTask = req.body

//     if (getTask){
//         const ifProject = taskSchema.findOneAndUpdate(
//             {projectName: getTask.projectName},
//             {$push:{task:getTask.task}},
//             function(err,success){
//                 if (err){
//                     console.log(getTask)
//             const assignTask = new taskSchema({
//             projectName: getTask.projectName,
//             task: getTask.task,
//             assignedTo: getTask.employee,
//             taskStatus: 'active',
            
//         });
//         const val = assignTask.save();
//         console.log(val)
//         res.redirect('addproject/project')

//                 }else{
//                     res.redirect('/addproject/project')
//                 }
//             }
//         )
        
//     }else{
//         console.log(ifProject)
//         res.redirect('addproject/project')
//     }
// },
async assigntask(req,res){
    const getTask = req.body
    if (getTask){

        taskSchema.findOne({projectName: getTask.projectName},(err,project)=>{
            if(project){
                taskSchema.findOneAndUpdate(
                    {projectName: getTask.projectName},
                    {$push: {task: getTask.task}},
                    (err,success)=>{if(err){
                        console.log(err)
                    }else{
                        console.log(success)
                    }
                }
                )
            }else{
                // const employee = getTask.assignedTo
                // User.findOne({username:employee},(err,lead)=>{
                //     if(err){
                //         res.redirect('addproject/project')
                //     }else{
                //         console.log(lead)
                        const assignTask = new taskSchema({
                            projectName: getTask.projectName,
                            task: getTask.task,
                            assignedTo: getTask.employee,
                            // teamLead: lead.teamLeader,
                            taskStatus: 'active'
                        });
                        const value = assignTask.save();
                        console.log(value)
                        res.redirect('addproject/project')
                    // }
                // })
                
            }
        })
    // }else{
    //     res.redirect('/addproject/project')
    // }

    //     console.log(getTask)
    //     const assignTask = new taskSchema({
    //         projectName: getTask.projectName,
    //         task: getTask.task,
    //         assignedTo: getTask.employee,
    //         taskStatus: 'active',
            
    //     });
    //     const val = await assignTask.save();
    //     console.log(val)
    //     res.redirect('addproject/project')

    // }else{
    //     res.redirect('addproject/project')
    }
    
    
    // res.send(val)


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