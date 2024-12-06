const User=require('../model/user');
const { use } = require('../routes/items');
const nodeMailer=require('nodemailer');
const { error } = require('console');

module.exports.renderRegisterForm=(req,res)=>{
    // console.log(req.session);
    if(req.session.username && req.session.email)
    return res.render('./user/register1.ejs',{title:'Register'});
    req.flash('error','UNAUTHARIZED');
    res.redirect('/register1');
}
module.exports.renderRegisterForm1=(req,res)=>{
    res.render('./user/register.ejs',{title:'Register'});
}

module.exports.submitRegisterForm1=async(req,res)=>{
    try{
        const {username,email}=req.body;
        req.session.username=username;
        req.session.email=email;
        const key=Math.floor(Math.random()*1e6);
        req.session.key=key;
        const output=`<h1>Verifying Email Address <h1><ul>
        <li>Name: ${username}</li>
        <li>Email: ${email}</li>
        <li>Phone :***********12</li>
        <li>Company: Unusable2Usable </li>
        </ul>
        <h3>Message</h3>
        <p>pin = ${key}
        </p>`

        //creating reusable transporter using default smtp transport
        let transporter=nodeMailer.createTransport({
            host:'smtp.gmail.com',
            hostname: "smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user: process.env.user,
                pass: process.env.pass
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        let mailerOption={
            from:'cp8913063@gmail.com',
            to:email,
            subject:'Unusable2Usable',
            text:`pin:${key}`,
            html:output// HTML TEXT
        };
        transporter.sendMail(mailerOption,(error,info)=>{
            if(error){
                console.log(error);
                return res.send(error);
            }
            console.log(`MESSAGE SENT ${info.messageId}`);
            // console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info)); // ONLY IF WE SEND MAIL THROUGH ETHERAL
            
            
        })
        req.flash('success',`pin is successfully send to ${email}`);
        res.redirect('/register');
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register1')
    }
    // console.log(newuser)
};
module.exports.submitRegisterForm=async(req,res)=>{
    try{
        const username=req.session.username;
        const email=req.session.email;
        const key =req.session.key;
        req.session.username=null;
        req.session.email=null;
        const {pin,password}=req.body;
        if(key!=pin){
            console.log(key,pin);
            req.session.key=null;
            req.flash('error','Wrong pin. Please try again.');
            return res.redirect('/register1');
        }
        req.session.key=null;
        const user=new User({username,email,password});
        const newuser=await User.register(user,password);
        req.flash('success','Welcome to YelpCamp.You are Successfully Registered and Logging you In!')
        req.login(newuser,err=>{
            if(err){
                return next(err);
            }
            res.redirect('/items');
        })
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    // console.log(newuser)
};
module.exports.submitChangePasswordForm=async(req,res)=>{
    try{
        // console.log(req.session.changeUser);
        const {pin,newPassword,confirmPassword}=req.body;
        console.log(newPassword,confirmPassword);
        if(newPassword!=confirmPassword){
            req.flash('error','password donot match,please try again');
            return res.redirect('/forgotPassword');
        }
        const user=await User.findById(req.session.changeUser);
        if(user.password!=pin){
            req.flash('error','pin donot match,please try again');
            return res.redirect('/login');
        }
        user.setPassword(newPassword,()=>{
            user.password = Math.floor(Math.random()*1e6);
            user.save();
        });
        console.log(user);
        req.flash('success','new password is created');
        req.session.changeUser="";
        res.redirect('/login');
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/forgotPassword')
    }
    // console.log(newuser)
};

module.exports.renderLogInForm=(req,res)=>{
    res.render('./user/login',{title:'Login'})
}
module.exports.changePasswordForm=(req,res)=>{
    if(req.session.changeUser&&req.session.changeUser!="")
    return res.render('./user/changePassword',{title:'Change Password'})
    req.flash('error','UNAUTHARIZED');
    res.redirect('/login');
}

module.exports.LogIn=(req,res)=>{
    req.flash('success','Welcome Back!!')
    // console.log(req.session)
    const redirecturl=req.session.returnTo || '/items'
    delete req.session.returnTo;
    res.redirect(redirecturl)
}

module.exports.LogOut=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully Logged You Out')
        return res.redirect('/')
    });
}

