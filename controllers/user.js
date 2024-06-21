const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.Signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registereduser=await User.register(newUser,password);
        req.login(registereduser,(error)=>{
            if(error){
                next(error);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login=async (req,res)=>{
  req.flash("success","Welcome back to Wanderlust!");
  let redirectUrl=res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut=(req,res)=>{
    req.logout((error)=>{
        if(error){
            return next(error);
        }
       req.flash("success","You are Logged Out Successfully!");
       res.redirect("/listings");
    });
};