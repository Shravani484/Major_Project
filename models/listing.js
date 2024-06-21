const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const listingschema=new Schema({
    title : {
        type:String
    },
    description : {
        type:String
    },
    image : {
        url:String,
        filename:String
    },
    price : {
        type: Number
    },
    location : {
        type:String
    },
    country : {
        type:String
    },
    review:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["Farms","Trending","Bread and Breakfast","Water Pools","Mountains","Beaches","Arctic","Crusie"]
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            requried:true
        },
    }
});
 
listingschema.post("findOneAndDelete",async (listing)=>{
   if(listing.review.length){
     await Review.deleteMany({_id:{$in:listing.review}});
   }
});

const listing=new mongoose.model("listing",listingschema);
module.exports=listing;

