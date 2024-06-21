const express=require("express");
const router=express.Router({mergeParams:true});
const {isLoggedIn,isReviewAuthor,validatereview}=require("../middlewares.js");
const wrapAsync=require("../utils/wrapAsync.js");

const reviewController=require("../controllers/review.js");

//reviews route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));
  
//Deleting Review route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;