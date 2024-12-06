// if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 80;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError');
// const ExpressError = require('./utils/expressError');
const campgroundrouter=require('./routes/items')
const reviewrouter=require('./routes/buyers')
const authrouter=require('./routes/auth')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const localStratigy=require('passport-local')
const User=require('./model/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');
const MongoStore=require("connect-mongo");
const {renderForgotPassword,PostForgotpassword}=require('./controller/forgotpassword');


app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// const Db_Url='mongodb://127.0.0.1:27017/Unusable2Usable';
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
mongoose.connect(process.env.Db_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // strictQuery:true
    // useCreateIndex:true
    // useFindAndModify:true
});
const db = mongoose.Connection;
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once("open", () => {
    console.log('Database Connected');
});

//  note while using router params of each routes get seperated so if app page contain /home/:id
// and router page try to access that id then it cannot so in order to access that make mergeparams:true

// const store=new mongoDBStore({
//     url:Db_Url,
//     secret:'thisisnotagoodsecret',
//     touchAfter: 24*3600
// });

// store.on('error',function(e){
//     console.log("Session Store Error");
// })

const sessionopt={
    // name:"ghsdg",
    store: MongoStore.create({ mongoUrl: process.env.Db_Url,touchAfter: 24 * 3600}),
    secret:'thisisnotagoodsecret',
    resave:false,
    saveUnitialized:true,
    cookie:{
        httponly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        age:1000*60*60*24*7
    }
}



app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js"    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    "https://source.unsplash.com/collection/483251",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhtxywza0/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://source.unsplash.com/collection/483251",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
    );
    app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
//   });
// app.use(helmet({     crossOriginResourcePolicy: false,     crossOriginEmbedderPolicy: false,    }));
// app.use(helmet.crossOriginEmbedderPolicy(false));
// app.use(helmet.crossOriginOpenerPolicy(false))
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));









app.use(session(sessionopt))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStratigy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(mongoSanitize({
    replaceWith: '_'
}));


app.use((req, res, next) => {
    console.log(req.url, req.method);
    // console.log(req.session)
    // console.log(req.user)
    // console.log(req.query)
    next();
})

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user;
    next()
})

app.get(
    '/',
    (req, res, next) => {
        res.render('MainPage',);
    }
)
app.route('/forgotpassword')
    .get(renderForgotPassword)
    .post(PostForgotpassword)
app.use('/items',campgroundrouter)
app.use('/items/:id/reviews',reviewrouter)
app.use('/',authrouter)

app.all('*', (req, res, next) => {
    next(new expressError("Page Not Found", 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('error', { err, title: statusCode });
    console.log(err.name);
})


app.listen(port, () => {
    console.log('http://127.0.0.1:80/')
})