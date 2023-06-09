const express=require('express');
const  connect  = require('./config/conect');
const sigupSchema = require('./model/schema');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const loclalAuth = require('./middleware/passauth');
const googleauth = require('./middleware/googleAuth');
const gitAuth = require('./middleware/githubauth');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config()
let port = process.env.PORT || 7777;
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({ extended:true}))
app.use(express.static(__dirname+'/public'))
console.log(__dirname+'/views');
app.set('view engine', 'ejs');
app.set('views',__dirname+'/views')
app.use(express.json());
app.use(session({secret:'ambaliyavivek'}))
app.use(passport.initialize());
app.use(passport.session());
loclalAuth(passport);
googleauth(passport);
gitAuth(passport);
app.get('/sigup',(req,res)=>{
    res.render("signup")
});
app.get('/',(req,res)=>{
    res.render("index")
})
app.post('/sigup',async(req,res)=>{
    // try {
        let usernamebody =req.body.username
        let password = req.body.password
        let Cpassword = req.body.Confirmpassword
        let chackuser = await sigupSchema.findOne({username:usernamebody})
        console.log(chackuser);
        if(chackuser){

          return  res.send('username already used');
        }
        else if(!chackuser){
        
        if(password==Cpassword){
            bcrypt.hash(password, 10, async (err, hash)=> {
                if(err) {
                 console.log(err);
                }
                else{
                    req.body.password = hash; 
                    console.log(hash);
                    await sigupSchema.create(req.body)
                    return res.render('login')
                }
             });
            // res.cookie('username', chackuser.Username)
        }
        else{
            return  res.send('password not match');
        }
    }
        else{
           return  res.send('password not match');
        }
    // } catch (error) {
    //     console.log(error);
    // }

    // await sigupSchema.create(req.body)
    // console.log(req.body);
    // res.send("done")
})
// login page
app.get('/login',(req,res)=>{
    res.render("login")
})
let passportAuth = passport.authenticate('local', { failureRedirect: '/login'  })
app.post('/login',passportAuth, async(req,res)=>{

    console.log(req.body);
    try {
        let username = req.body.username
        let corect = await sigupSchema.findOne({username:username})
        let password = req.body.password
        let bcryptpassword = corect.password
        console.log(bcryptpassword);
        console.log(`email =${username} password =${password}`);
        if(corect.username === username ){
            req.session.views=corect.id;
            console.log(req.session);
            return res.render('blog')
            res.send("done")
        }
        else{
            return res.send("passwor is not a valid password")
        }
        console.log(corect);
    } catch (error) {
        console.log(error);
    }
});
// blog
app.get('/blog',(req,res)=>{
    res.render('blog')
})
app.post('/blog',async(req,res)=>{
    let sessionId =req.session.views
    console.log(req.body);
    let blog = await sigupSchema.findById(sessionId)
    if(blog){
        blog.cart.push({
            title:req.body.title,
            discripction:req.body.discripction,
            authorname:req.body.authorname
        })
        let data= await sigupSchema.findByIdAndUpdate(sessionId,blog)
        res.redirect('/blogview')
    }
    else{
        res.redirect('/login')
    }
    
})
app.get('/blog/view', async(req, res)=> {
    let sessionId =req.session.views
    let blog = await sigupSchema.findById(sessionId)
    res.send(blog)
  });
  app.get('/blogview',(req, res) => {
    res.render('blogview')
  });
  app.get('/editblog/id',(req, res) => {
    id = req.params.id;

  });
// sing up with google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/sigup' }),
  function(req, res) {
    console.log(req.user);
    res.render('blog')
  });
//   github to sign up
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email','email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect('/');
  });

// cart
app.get('/singleproduct',(req,res)=>{
    res.render('single-product')
})
app.post('/singleproduct',async(req,res)=>{
    let id = '6450f12c27e1c20d6a717ed3'
    let bodycart=cart.push({
        name:req.body.name,
        email:req.body.email
    })
     await sigupSchema.findByIdAndUpdate(id,bodycart)
    res.send("done")
})


// forgot password
app.get('/forgot',(req,res)=>{
    res.render('forgot')
})
let otp =0
let changeemil = 0
app.post('/foremail',(req,res)=>{
    changeemil = req.body.email
    console.log(changeemil);
    let teanspotrr = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"ambaliyavivek2@gmail.com",
            pass:"dfwsihxmrrzskiye"
        }
    })
     otp = Math.ceil(Math.random()*10000)
    console.log(otp);
    let mailoption ={
        from:"ambaliyavivek2@gmail.com",
        to:changeemil,
        subject:"this is",
        text: `otp =${otp}`
        
    }
    teanspotrr.sendMail(mailoption , (err,info)=>{
        if(err){
            return res.send( "error")
        }
        else{
            res.render('enterotp')
        }
    })
})
app.get('/enterotp',(req,res)=>{
    res.render('enterotp')
})
app.post('/enterotp',(req,res)=>{
    let { Cotp }= req.body
    if(Cotp == otp){
       return res.render('passchange')
    }
    else{
       return res.render('enterotp')
    }
    console.log(Cotp);
    res.send("confirm")
})
app.get('/passchange',(req,res)=>{
    res.render('passchange')
})
app.post('/passchange',async (req,res)=>{
    let {newpass,confpass} = req.body
    let data = await sigupSchema.findOne({email:changeemil})
    let userid =data.id
    if(newpass == confpass){
        data.password = newpass
        await sigupSchema.findByIdAndUpdate(userid,data)
        return res.render('login')
    }
    else{
       return res.send("password not match")
    }
    console.log(newpass,confpass);
    res.send("passwors is change")
    
})
app.listen(port, ()=>{
    console.log(`localhost:${port}`);
    connect()
}); 
