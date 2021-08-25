const Campground = require('../model/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const cloudinary = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

module.exports.index =async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
 }
 module.exports.renderForm = (req,res)=>{
    res.render('campgrounds/new');
  }
  module.exports.showPage = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
      path:'reviews',
      populate:{
        path:'author'
      }
     }).populate('author');
    console.log(campground);
    if(!campground){
      req.flash('error','Cannot find that Campground');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
    if(!campground.author[0].equals(req.user._id)){
     req.flash('error','You do not have permission to do that');
     return res.redirect(`/campgrounds/${id}`);
    }else{
     res.render('campgrounds/show',{campground});
    }
}
module.exports.createNewCampground = async(req,res,next)=>{
  const geoData = await geocoder.forwardGeocode({
    query:req.body.campground.location,
    limit:1
  }).send()

   const campground = new Campground(req.body.campground);
   campground.geometry = geoData.body.features[0].geometry;
   campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
   campground.author = req.user._id;
  await campground.save();
  req.flash('success','Successfully created new Campground');
  res.redirect(`/campgrounds/${campground._id}`)
 
}

module.exports.editCampgroundForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
     req.flash('error','Cannot find that Campground');
     return res.redirect('/campgrounds');
   } 
   res.render('campgrounds/edit',{campground});
}
module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
  
    console.log(req.body);
    const campground  = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
     
     await campground.updateOne({$pull:{images:{filename :{$in:req.body.deleteImages }}}})
    }
     req.flash('success','Successfully updated a Campground');
     res.redirect(`/campgrounds/${campground._id}`)
   
  }
  module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a Campground');
    res.redirect('/campgrounds');
  }