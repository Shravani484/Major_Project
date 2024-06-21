const review=require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    let accesslisting=await listing.findById(id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;
    accesslisting.review.push(newreview);
    await newreview.save();
    await accesslisting.save();
  
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};