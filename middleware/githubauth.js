const passport = require('passport');
 
const GitHubStrategy = require('passport-github2');
require('dotenv').config()
console.log(process.env)
const gitAuth = (passport)=>{
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.callbackURLgit
      },
      function(accessToken, refreshToken, profile, done) {
        done(null ,profile)
      }
    ));
    passport.serializeUser((user,done)=>{
        return done(null ,user)
    })
    
    passport.deserializeUser((user,done)=>{
      return done(null ,user)
    })
}
module.exports =gitAuth