 const taskschema =require('../../models/taskschema')
function admincontroller(app){
    return{
        async fetchtaskDetails(req,res){
            taskreport.find({},(err,report)=>{
                if (err) throw err
                else{
                    console.log(report)
                    res.render('admin/taskdetails.ejs',{'taskreport':report})
                }
            })
            // res.render()
        },
        async deleteaddedTask(req,res){
            project.update(
                { projectName: req.body.projectName }, 
                { $pull: { task: req.body.taskName } },
                function(err,success){
                    if (err){
                        res.send(err)
                    }else{
                        res.redirect('/addproject')
                    }
                }
                // false, // Upsert
                // true, // Multi
            )
    
        },
        async deleteAssignedTask(req,res){

            await taskschema.deleteOne(
                {_id:req.body.projectid}

            ).then(result=>{
                console.log(result,'project deleted successfully')
                res.redirect('/addproject/project')
            }).catch(err => console.log(err))
            
            // taskschema.update(
            //     {_id : {$in : req.body.projectid},
            //     task:{$in : req.body.taskName},
            //     assignedTo:{$in:req.body.assignedTo}
            //     },
            //     {$pull:{task:req.body.taskName}},
            //     function(err,success){
            //         if (err){
            //             console.log(err)
            //             res.redirect('/addproject/project')
            //         }else{
            //             res.redirect('/addproject/project')
            //         }
            //     }
            //     )
        },
        async updateTaskname(req,res){
            project.update(
                { projectName: req.body.projectName }, 
                { $pull: { task: req.body.taskName } },
                function(err,success){
                    if (err){
                        res.send(err)
                    }else{
                        res.redirect('/addproject')
                    }
                }
                // false, // Upsert
                // true, // Multi
            )
        },
        async updateAssignedTask(req,res){
            project.update(
                {
                    _id:{$in:req.body.projectid},
                    task:{$in:req.body.taskName}
                },
                {$pull:{task:req.body.taskName}},(err,success)=>{
                    if (err){
                        console.log(err)
                    }else{
                        project.updateOne(
                            {
                                _id:req.body.projectid
                            },
                            {$addToSet:{task:req.body.updatedName}},(err,result)=>{
                                if (err){
                                    res.send(err)
                                }else{
                                    console.log(result)
                                    res.redirect('/addproject')
                                    // res.send('Task Updated Successfully')
                                }
                            }
                        )
                    }

                }
            )
        }
       
        
    }
}



module.exports = admincontroller
    
    