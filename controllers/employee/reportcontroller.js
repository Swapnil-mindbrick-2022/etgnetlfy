const employee = require('../../models/user')
const taskreport = require('../../models/taskreport')
const { request } = require('express')
const fs = require("fs");
const imageModel = require('../../models/profilepic');

// const { connect } = require('mongoose')

function fetchProjectReport(app){
    return {
        async submitProjectData(req,res){
            const reportData = await req.body
            console.log(reportData)
            // let emp;
                // const unique = req.session.userId
                // console.log(unique)
                // if (unique){
                    employee.findOne({_id:req.user.id},(err,emp)=>{
                        if (err){
                            console.log(err)
                        }else{
                            console.log(emp)
                            if (reportData){
                                // const zeroFill = n => {
                                //     return ('0' + n).slice(-2);
                                // }
                                //     const now = new Date();
                    
                                //     // Format date as in mm/dd/aaaa hh:ii:ss
                                //     const dateNow = zeroFill((now.getMonth() + 1)) + '/' + zeroFill(now.getUTCDate()) + '/' 
                                //     + now.getFullYear()
                                    
                
                                new taskreport({
                                    projectName: reportData.projectName,
                                    task: reportData.task,
                                    timetaken: reportData.timetaken,
                                    teamleader: emp.teamLeader,  // must have error handling here
                                    assignedTo: emp.username,
                                    // date: dateNow
                                })
                                .save()
                                .then(console.log).then(res.redirect('/userTask'))
                              
                                // console.log(taskReport)
                                
                            }
                        }
                    })
                // }

            // }
            

            

        },
        async getaddedTask(req,res){
            taskreport.find({},(err,reports)=>{
                if (err){
                    console.log(err)
                }else{
                    res.render('employee/userTask.ejs',{'reporttask':JSON.stringify(reports)})
                }
            })

        },
        //
        async submitTaskOnTable(req,res){
            let pending = req.body
            //if submitting the data from table-----
            employee.findOne({_id:req.user.id},(err,employee)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log(employee)
                    //finds the reports matching the userName
                    taskreport.find({assignedTo: employee.username},(err,reports)=>{
                        if (err){
                            console.log(err)
                        }else{
                            let activeTasks = reports.filter((report)=>{
                                return report.taskStatus == 'pending'
                            })
                            activeTasks.forEach((task)=>{
                                taskreport.findOneAndUpdate({_id: task._id},{$set:{taskStatus:'submit'}},{new:true},(err,doc)=>{
                                    if (err){
                                        console.log(err)
                                    }else{

                                        console.log(doc,'success')
                                        // res.redirect('/userTask')
                                    }
                                })
                            })
                        }
                    })
                    
                }

            })
            
        
        },
        async deletprojectTask(req,res){
            taskreport.findByIdAndRemove(req.params.id,(err)=>{
                if (err){
                    res.redirect('/userTask')
                }else{
                    res.redirect('/userTask')
                }
            })
            

            
        },
        async postProfile(req,res){
            const data = req.body
            console.log(data)
            employee.findOne({_id:data.userid},(err,profilepic)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(profilepic)

                    var img = fs.readFileSync(req.file.path);
                    var encode_img = img.toString('base64');
                    const final_img = {
                        contentType:req.file.mimetype,
                        image:new Buffer(encode_img,'base64')
                    };
                 
                    new imageModel({
                        img:req.file.originalname,
                        uploadedBy:profilepic.id,
                        username:profilepic.username
                        
                    })
                    .save()
                    .then(console.log(req.file))
                    res.redirect('/adminpanel')
                    // res.send('success')
                   
                }
            })

       
        },
        async taskhistory(req,res){
            const username = req.body.username
            console.log(username)
            await taskreport.find({
                assignedTo: {$in : username},
                date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}

            },(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    const history = result.filter((value)=>{

                        return value.taskStatus=='submit'

                    })
                    res.render('employee/taskdata.ejs',{'history':history})
                    // res.send(history)
                }
            }).sort({ "date": -1 })
        }
       
    }
   

}
module.exports = fetchProjectReport;