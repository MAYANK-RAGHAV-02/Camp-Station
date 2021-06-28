if(process.env.NODE_ENV !=="production") {
    require('dotenv').config();
}

const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const methodoverride= require('method-override')
const ejsMate = require('ejs-mate');
const session = require('express-session') 
const stationRoute = require('./routes/Station')
const reviewRoute = require('./routes/Reviews')
const userRoute = require('./routes/User')
const morgan = require('morgan')
const flash = require('connect-flash')
const app =express();
const user = require('./models/User');
const User = require('./models/User');
const bcrypt = require('bcrypt')
const multer  = require('multer');
const { loginStrict } = require('./middleware');
const upload = multer({ dest: 'uploads/' })
const MongoStore = require('connect-mongo');



// app.use(session({secret: 'notgood',resave:false, saveUninitialized:false}))
const dbUrl = process.env.DB_URL ||  'mongodb://localhost:27017/project'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindOneAndModidy  :false
})
.then(()=>{
    console.log('something from the mongoose')
})
.catch(e=>{
    console.log('error from the mongoose')
    console.log(e)
}) 

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
app.use(express.static(path.join( __dirname,'public')))

const secret = process.env.SECRET || 'secret'
const sessionconfig = {
  
    secret :secret,
    resave: false,
    saveUninitialized : true ,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 
      }),
    cookie:{ 
        httpOnly : true,
        // secure:true,
        expires : Date.now() +1000*60*60*24*3,
        maxAge : 1000*60*60*24*3,
    }} 
 
app.use(session(sessionconfig));
app.use(flash());

app.use((req,res,next)=>{
    // console.log(req.query)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.user = req.session.user_id
    next();
})


app.use('/', stationRoute)
app.use('/', reviewRoute)
app.use('/',userRoute)
// app.use(morgan('common'))





app.get('/home',loginStrict,(req,res)=>{
    res.render('home')
    
}) 
app.get('*',(req,res)=>{
    req.flash('error','Page Not Found')
    res.redirect('/station')
})

app.use((err,req,res,next)=>{
 const {status = 500}=err;
 if(!err.message)err.message='Oh no something went wrong'
 res.status(status).render('error',{err})
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`serving from ${port}`)
}) 



 



// const passport = require('passport')
// const localpasport = require('passport-local');
// const { initialize } = require('passport');
// app.use(passport.initialize())
// app.use(passport.session())
// passport.use( new localpasport(User.authenticate()));
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())
// const { nextTick } = require('process');
// const appErr = require('./errorhandler/appErr')
// const catchAsync = require('./errorhandler/catchAsync')
// const Review = require('./models/Reviews')
// const Station = require('./models/Stations');