const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const ejs=require('ejs');
const mongoose=require('mongoose');
const User=require('./models/user');
const Secret=require('./config/dev');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('passport');
const bcrypt=require('bcryptjs');
const user = require("./models/user");
const {upload}=require('./helper/aws');
const formidable=require('formidable');
const { Budgets } = require('aws-sdk');
require('./passport/local');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
    secret:'kyakarrehehohacker',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
// make user gobal 
app.use(function(req,res,next){
    res.locals.user=req.user||null;
    next();
});

mongoose.connect(Secret.MongoDB,{ useNewUrlParser: true },function(req,res){
    
    console.log("MongoDB is connected");
});
var dir=__dirname;
var ans;

app.listen(3000,function(req,res)
{
    console.log("We are at port 3000");
});
app.get('/portfolio',function(req,res){
    res.render("portfolio",{ans,ans});

});
app.get("/",function(req,res){
    res.sendFile(dir+"/index.html");

});

app.get('/signup',(req,res)=>{
    res.render("signup",{err:""});
})
app.get('/login',(req,res)=>{
    res.render("login",{message:""});
})
app.get('/contactus',(req,res)=>{
    res.render('contact')
})
app.get('/loginerr',function(req,res)
{
    res.render('loginerr',{err:"Your Account doesnot exits you can create your account or worong password"});
});

app.get('/loginerr',function(req,res)
{
    res.render('loginerr',{err:"Your Account doesnot exits you can create your account or worong password"});
});
app.get('/profile',(req,res)=>{
    user.findById({_id:req.user._id},function(err,user){
        if(err)
        {
            console.log(err);
        }
        if(user)
        {
            res.render('profile',{user:user});
        }
    })
});
app.get('/form/:id',(req,res)=>{
    User.findOne({_id:req.params.id},function(err,user)
    {
        if(err)
        {
            console.log(err);
        
        }
        if(user)
        {
            res.render('form',{user:user});
        }
    })
});
app.get('/logout',(req,res)=>{
    User.findById({_id:req.user._id},function(err,user){
        if(err)
        {
            console.log(err);
        }
        if(user){
            req.logout();
            res.redirect('/');
        }
    })
});
app.get('/portfolio/:id',(req,res)=>
{
    User.findById({_id:req.params.id},(err,user)=>{
        if(err)
        {
            console.log(err);
        }
        if(user)
        {
            user.link="/portfolio/"+user.id;
            user.img=user.ans.image;
            user.save(function(err,user)
            {
                if(err)
                {
                    console.log(err);
                }
                if(user)
                {
                    //console.log(user.ans);
                   
                    res.render('portfolio',{ans:user.ans});

                }
            })
            
        }
    })
    
});
app.get('/home',(req,res)=>{
    res.render('home');
})
// all post route

app.post('/form/:id',function(req,res){
    ans=req.body;
    const s1="https://carrentalapp6459.s3.ap-south-1.amazonaws.com/"+req.body.image;
    ans.image=s1;
    //console.log(ans);


    User.findById({_id:req.params.id},(err,user)=>{
        if(err)
        {
            console.log(err);
        }
        if(user)
        {
            var s="/"+"portfolio/"+user.id;
            //console.log(s);

            user.ans=ans;

            user.save((err,user)=>
            {
                if(err)
                {
                    console.log(err);
                }
                if(user)
                {
                    console.log('success');
                }
            })
            res.redirect(s);
        }
    })
});
app.post('/signup',(req,res)=>{
    let err=[]
    if(req.body.password!==req.body.password2)
    {
        err.push({text:'Password does not match'});
    }
    else if(req.body.password.length<5)
    {
        err.push({text:'Password length should atleast be 5 character long'});
    }
    if(err.length>0)
    {
        //console.log(err);
        res.render('signup',{err:err});
    }
    if(req.body.password===req.body.password2) {
        User.findOne({email:req.body.email},function(err,user)
        {
            if(user)
            {
                let err=[]
                err.push({text:'email already exits'});
                //console.log(err);
                res.render('signup',{err:err});

            }
            else{

                let salt=bcrypt.genSaltSync(10);
                let hash=bcrypt.hashSync(req.body.password,salt);
                
                const newuser={
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    password:hash,
                    

                }
                
                new User(newuser).save(function(err,user)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        var l="You have sucessfully created an Account! you can Login now";
                        console.log("Successfully added user");
                        res.render('login',{message:l});
                    }
                })
            }

        });
    }
})
app.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/loginerr',
}));
app.post('/uploadImage',upload.any(),function(req,res){
    const form=new formidable.IncomingForm();
    form.on('file',(field,file)=>{
        console.log(file);
    });
    form.on('error',(err)=>{
        console.log(err);
    });
    form.on('end',()=>{
        console.log("success");
    });
    form.parse(req);

});