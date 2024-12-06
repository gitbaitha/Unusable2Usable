const express=require('express')
const router=express.Router();
const User=require('../model/user')
const wrapAsync=require('../utils/catchAsync');
const passport=require('passport')
const authC=require('../controller/auth')

router.route('/register1')
    .get(authC.renderRegisterForm1)
    .post(wrapAsync(authC.submitRegisterForm1));
router.route('/register')
    .get(authC.renderRegisterForm)
    .post(wrapAsync(authC.submitRegisterForm));


router.route('/login')
    .get(authC.renderLogInForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),
    authC.LogIn
)
router.route('/changePassword')
    .get(authC.changePasswordForm)
    .post(authC.submitChangePasswordForm);


router.get('/logout',wrapAsync(authC.LogOut))

module.exports=router;