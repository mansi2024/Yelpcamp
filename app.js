if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users')
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


const methodOverride = require('method-override');
const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false  
})
.then(()=>{
    console.log('Database Connected');
})
.catch((err)=>{
  console.log("connection error");
  console.log(err);
})


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));



const sessionConfig = {
  name:'session',
  secret : 'thisshouldbebettersecret',
  resave : false,
  saveUninitialized : true,
  cookie :{
    httpOnly :true,
    expires : Date.now() + 1000* 60*60*24*7,
    maxAge :1000* 60*60*24*7

  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
app.use('/',userRoutes);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);
app.use(mongoSanitize());





const validateCampground = (req,res,next)=>{
 
  const {error} = campgroundSchema.validate(req.body);
 if(error){
   const msg = error.details.map(el=>el.message).join(',')
   throw new ExpressError(msg,404);
     }
    else{
      next();
    }
}


app.get('/',(req,res)=>{
    res.render('campgrounds/home')
})


app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found!!',404))
})

app.use((err,req,res,next)=>{
   const {statusCode=500} = err;
   if(!err.message) err.message = 'Something Went Wrong!!' 
   res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log("welcome to port 3000")
})