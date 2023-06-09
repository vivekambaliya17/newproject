const sigupSchema = require("../model/schema");
const bcrypt = require('bcrypt');


const loclalstrtegy =require('passport-local').Strategy
const loclalAuth =(passport)=>{
    console.log("fghjk");
    passport.use(
        new loclalstrtegy( async(username, password, done)=>{
            let sigupSchema1 = await sigupSchema.findOne({username :username})
            let bcryptpassword = sigupSchema1.password
        console.log(bcryptpassword);
            console.log(sigupSchema1);
            try {
                if(!sigupSchema1){
                    return done(null, false)
                }
                
                let becpass = await  bcrypt.compare(password, bcryptpassword)
                console.log(becpass);
                if(!becpass){
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