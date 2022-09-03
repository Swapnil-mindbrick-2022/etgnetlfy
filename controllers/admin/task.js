
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
        }
        
    }
}



module.exports = admincontroller

