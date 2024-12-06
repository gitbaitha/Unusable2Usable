const nodeMailer=require('nodemailer');
const { error } = require('console');
const User = require('../model/user');


module.exports.renderForgotPassword=(req,res)=>{
    res.render('./user/forgotpassword.ejs');
}
module.exports.PostForgotpassword=async(req,res)=>{
    // console.log(req.body);

    const user=await User.findOne({username:req.body.username})
    if(user===null||user.username===null){
        req.flash('error','Wrong username')
        return res.redirect('/forgotpassword')
    }
    const otp=Math.floor(Math.random()*1e6);
    user.password=otp;
    user.save();
    const output=`<h1>Mail Regarding Forgot Password<h1><ul>
    <li>Name: ${user.username}</li>
    <li>Email: ${user.email}</li>
    <li>Phone :***********12</li>
    <li>Company: Unusable2Usable </li>
    </ul>
    <h3>Message</h3>
    <p>pin = ${otp}
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
        to:user.email,
        subject:'Unusable2Usable',
        text:`pin:${user.password}`,
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
    req.flash('success','password is sent through email')
    req.session.changeUser=user._id;
    res.redirect('/changePassword');
    // res.send('index');
}