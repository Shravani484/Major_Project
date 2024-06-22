const listing=require("../models/listing.js");
const expressError=require("../utils/expressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.indexrouter=async (req,res)=>{
    let lists=await listing.find();
    res.render("listings/index.ejs",{lists});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createNewListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    })
    .send()
    if(!req.body.listing){
      throw new expressError(400,"Send valid data");
    }
    const newlisting=new listing(req.body.listing);
    newlisting.owner=req.user._id;
    let url=req.file.path;
    let filename=req.file.filename;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.showIndividualListing=async (req,res)=>{
    let {id}=req.params;
    const data=await listing.findById(id).populate({path:"review",
     populate:{path:"author"}})
     .populate("owner");
    //console.log(data);
    if(!data){
     req.flash("error","Listing you are trying to view is not available!");
     res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
};

module.exports.renderUpdateForm=async (req,res)=>{
    let {id}=req.params;
    const data=await listing.findById(id);
    if(!data){
      req.flash("error","Listing you are trying to update is not available!");
      res.redirect("/listings");
    }
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250/h_200");
    
    res.render("listings/update.ejs",{data,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let editlisting=await listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        editlisting.image={url,filename};
    }
    await editlisting.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    const dellisting= await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

const ifnolistingisavailable=(req,res,lists)=>{
    if(lists.length){
        res.render("listings/index.ejs",{lists});
    }else{
        req.flash("success","Listings are not available");
        res.redirect("/listings");
    }
}
module.exports.searchByLocation=async(req,res)=>{
    let lists=await listing.find({$or:[{location:req.query.location},{country:req.query.location}]});
    ifnolistingisavailable(req,res,lists);
}

module.exports.searchByCategory=async(req,res)=>{
    let lists=await listing.find({category:req.query.category});
    ifnolistingisavailable(req,res,lists);
}

