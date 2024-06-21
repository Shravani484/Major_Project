const express=require("express");
const router=express.Router();
const listingController=require("../controllers/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middlewares.js");
const storage=require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer(storage);

router.route("/")
    .get(wrapAsync(listingController.indexrouter))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),validatelisting,wrapAsync(listingController.createNewListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/category",wrapAsync(listingController.searchByCategory))
router.get("/search",wrapAsync(listingController.searchByLocation));

router.route("/:id")
    .get(wrapAsync(listingController.showIndividualListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderUpdateForm));

module.exports=router;