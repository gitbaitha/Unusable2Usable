const Campground=require('../model/items')
const Review=require('../model/buyers')

module.exports.createReview=async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author=req.user._id; 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success','Successfully sent Details!')
    res.redirect(`/items/${req.params.id}`);
};

module.exports.deleteReview=async(req,res)=>{
    // res.send("You have deleted!!!!")

    //it has its own log check middleware

    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted Buying Request')
    res.redirect(`/items/${id}`)
}