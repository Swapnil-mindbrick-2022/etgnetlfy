const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin')

exports.initializingPassport = (passport)=>{

    passport.use(
        new LocalStrategy( async(username,password,done)=>{
       
        try{
            const admin = await Admin.findOne({username})
            if (!admin) return done(null,false);


        if (admin.password !== password) return done(null,false);

        return done (null, admin)

        }
         catch (error){
            return done(error, false)
        }
        
    }))
    passport.serializeUser((admin,done)=>{
        done(null,admin.id)
    });
    passport.deserializeUser(async(id,done)=>{
        try{
            const admin = await Admin.findById(id);
            
            done(null, admin);
        }catch (error){
            done (error,false)
        }
    })
};

exports.isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/adminlogin');
}



