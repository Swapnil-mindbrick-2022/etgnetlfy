const User = require('../models/user')

function employee(req,res,next) {
    if(req.isAuthenticated() && req.user.role === 'employee') {
        
    
        // User.findOneAndUpdate({_id:req.user.id},{$set:{lastLogin:curdate}},(err,success)=>{
        //     if (err){
        //         console.log(err)
        //     }else{
                
        //         console.log(success)
        //     }
        // })

        return next()
        
    }
    return res.redirect('/')
}
module.exports = employee


