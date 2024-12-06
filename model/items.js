const mongoose=require('mongoose');
const Review=require('./buyers');
const Schema=mongoose.Schema;

// making virtual properties to be transferrable over javascript
//if not used then only accessable to the rendered page
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get (function(){
    return this.url.replace('/upload','/upload/w_200');
})
ImageSchema.virtual('HomePage').get (function(){
    return this.url.replace('/upload','/upload/w_400,h_300');
})
ImageSchema.virtual('showPage').get (function(){
    return this.url.replace('/upload','/upload/w_200,h_150');
})
const campgroundSchema=new Schema({
    title:String,
    image:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

},opts);

//setting up virtual properties
campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    let p=`/items/${this._id}`
    let z= `<strong><h4><a href=${p}>${this.title}</a></h4><strong><p>${this.description.substring(0,20)}</p>`
    return z
})


//middleware for deleting a campground   => 2 types Pre,post
campgroundSchema.post('findOneAndDelete',async function (doc){
    // console.log(doc);
    if(doc){
        
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',campgroundSchema);