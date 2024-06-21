if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const expressError=require("./utils/expressError.js");
const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const usersrouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const atlas_db_url=process.env.ATLAS_DB_URL;

main().then(res=>{console.log("connection successfull")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(atlas_db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const port=8080;
app.listen(port,()=>{
    console.log("Listening to port");
}); 

app.get("/",(req,res)=>{
     res.redirect("/listings");
});

const store=MongoStore.create({
    mongoUrl:atlas_db_url,
    crypto:{
      secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("ERROR",()=>{
  console.log("error in mongo session store",err);
})
const sessionOptions={ 
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ (7*24*60*60*1000),
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",usersrouter);

//error handling middleware for wrong route
app.use("*",(req,res,next)=>{
   next(new expressError(404,"Page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
});

