const Campground=require('./model/items')
const Review=require('./model/buyers')
const ExpressError=require('./utils/expressError')
const {campgroundSchema,reviewSchema}=require('./schema')


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl)
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be Logged In');
        res.redirect('/login')
    }else{
        next();
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You Dont have permission to do so')
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { title, location, price, description} = req.body;
    // if (!title || !location || !price || !description || !image) throw new ExpressError('Invalid Campground Data', 400);
    
    const { error } = campgroundSchema.validate({ title, price, description, location});
    // console.log(error);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 401);
    }else{
        next();
    }
}


module.exports.validatereview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const message=error.details.map(el=>el.message).join(',');
        throw new ExpressError(message,404)
    }else {
        next();
    }
}


module.exports.isreviewowner=async(req,res,next)=>{
    const {reviewId,id}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You Dont have permission to do so')
        return res.redirect(`/campground/${id}`)
    }
    next();
}
module.exports.isReviewLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.params)
        const id=req.params.id;
        req.session.returnTo=`/campground/${id}`;
        req.flash('error','You must be Logged In');
        res.redirect('/login')
    }else{
        next();
    }
}