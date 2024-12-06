const express=require('express')
const router=express.Router({mergeParams:true})
const Review=require('../model/buyers')
const Campground = require('../model/items.js');
const catchAsync = require('../utils/catchAsync');
const {validatereview,isLoggedIn,isreviewowner,isReviewLoggedIn}=require('../middleware')
const reviewC=require('../controller/buyers')


router.post('/',isReviewLoggedIn,validatereview,catchAsync(reviewC.createReview))

router.delete('/:reviewId',isReviewLoggedIn,isreviewowner,catchAsync(reviewC.deleteReview))

module.exports=router