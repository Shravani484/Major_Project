const express=require("express");
const router=express.Router();
const userController=require("../controllers/user.js");
const passport=require("passport");
const {saveOrignalUrl}=require("../middlewares.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.Signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveOrignalUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
    ,userController.Login);

router.get("/logout",userController.logOut);

module.exports=router;