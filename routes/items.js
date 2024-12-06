const express=require('express')
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../model/items.js');
const {campgroundSchema} = require('../schema');
const expressError = require('../utils/expressError');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');
const campgroundC=require('../controller/items')
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage})

router.route('/')
    .get(catchAsync(campgroundC.renderIndexPage))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgroundC.createCampground));
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.files,req.body);
    //     res.send("hi");
    // })
    

router.get('/new',isLoggedIn ,campgroundC.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundC.renderIndivisualShowPage))
    .put(isLoggedIn, catchAsync(isAuthor) ,upload.array('image'),validateCampground,catchAsync(campgroundC.submitEditedIndivisualCampground))
    .delete( isLoggedIn, catchAsync(isAuthor),catchAsync(campgroundC.deleteIndivisualCampground));

router.get('/:id/edit',isLoggedIn, catchAsync(isAuthor),catchAsync(campgroundC.renderEditIndivisualCampground))



module.exports=router;