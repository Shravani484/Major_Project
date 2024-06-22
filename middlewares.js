const listing=require("./models/listing.js");
const review=require("./models/review.js");
const {listingschema,reviewschema}=require("./schema.js");
const expressError=require("./utils/expressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You are not Logged In");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveOrignalUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let editlisting=await listing.findById(id);
    if(!editlisting.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let delreview=await review.findById(reviewid);
    if(!delreview.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",");
      throw new expressError(400,errmsg);
    }else{
      next();
    }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
      let errmsg=error.details.map((el)=>el.message).join(",");
      throw new expressError(400,errmsg);
    }else{
      next();
    }
};

