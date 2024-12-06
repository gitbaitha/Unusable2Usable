// MAPBOX_TOKEN='pk.eyJ1IjoiY3ByYWthc2gxIiwiYSI6ImNsZzZpNXBpMjBkZzkzaHFyMm83OGQyN3YifQ.5BnzbS1hsEGKg95hwpbQ7Q';
const Campground=require('../model/items')
const mbxgeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const {cloudinary}=require('../cloudinary');
// const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxgeocoding({accessToken:'pk.eyJ1IjoiY3ByYWthc2gxIiwiYSI6ImNsZzZpNXBpMjBkZzkzaHFyMm83OGQyN3YifQ.5BnzbS1hsEGKg95hwpbQ7Q'});
module.exports.renderIndexPage=async (req, res) => {
    console.log(req.url)
    const campground = await Campground.find();
    res.status(200).render('home', { campground, title: "Campground" });
}

module.exports.createCampground=async (req, res, next) => {
    const { title, location, price, description} = req.body;
    const image=req.files.map(f=>({url:f.path,filename:f.filename}));
    // console.log(image);
    const camp = await new Campground({ title, location, price, description, image });
    camp.author=req.user._id;
    req.flash('success','Successfully added Items!')
    const geoData=await geocoder.forwardGeocode({
        query: location,
        limit: 1
    })
    .send()
    camp.geometry=geoData.body.features[0].geometry;
    // console.log(geoData.body.features[0].geometry)
    await camp.save();
    // console.log(camp);
    res.redirect(`/items/${camp._id}`);
}

module.exports.renderNewForm=(req, res) => {
    res.status(200).render('new', { title: "New Campground" });
}

module.exports.renderIndivisualShowPage=async (req, res) => {
    //multilevel population
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error','cannot find the Item')
        return res.redirect('/items')
    }
    // console.log(camp);
    res.status(200).render('show', { camp, title: camp.title });
}

module.exports.renderEditIndivisualCampground = async (req, res) => {
    const item = await Campground.findById(req.params.id);
    if(!item){
        req.flash('error','cannot find the Item')
        return res.redirect('/items')
    }
    res.status(200).render('edit', { item, title: item.title });
}

module.exports.submitEditedIndivisualCampground=  async (req, res) => {
    const { title, location, price, description} = req.body;
    // console.log(req.body);
    const id = req.params.id;
    if (!title || !location || !price || !description  || !id) throw new ExpressError('Invalid Campground Data', 400);
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description });
    const im=req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.image.push(...im)
    await camp.save();
    if(req.body.deleteimage){
        await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteimage}}}})
        console.log(req.body.deleteimage);
        for( let p of req.body.deleteimage){
            await cloudinary.uploader.destroy(p);
        }
    }
    

    req.flash('success','successfully Updated Item Information!')
    res.redirect(`/items/${camp._id}`);
}

module.exports.deleteIndivisualCampground=async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','successfully Deleted Item!')
    res.redirect('/items');
}