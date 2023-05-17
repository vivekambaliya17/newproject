const sigupSchema = require("../model/schema");

const loclalstrtegy =require('passport-local').Strategy
const loclalAuth =(passport)=>{
    console.log("fghjk");
    passport.use(
        new loclalstrtegy( async(username, password, done)=>{
            let sigupSchema1 = await sigupSchema.findOne({username :username})
            console.log(sigupSchema1);
            try {
                if(!sigupSchema1){
                    return done(null, false)
                }
                if(sigupSchema1.password!== password){
                    return done(null, false)
                }
                return done(null, sigupSchema1)
            } catch (error) {
                return done(error,false)
            }
        })
    )
    passport.serializeUser((user, done)=> {
       return done(null, user.id); 
    });
    
    passport.deserializeUser((id, done)=> {
        let User =sigupSchema.findById(id)
        return done(null, User);
    });
}
module.exports =loclalAuth