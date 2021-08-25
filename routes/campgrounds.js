const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schema');
const campgrounds = require('../controllers/campground');
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const {isLoggedin} = require('../middleware');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});

const Campground = require('../model/campground');


const validateCampground = (req,res,next)=>{
 
  const {error} = campgroundSchema.validate(req.body);
 if(error){
   const msg = error.details.map(el=>el.message).join(',')
   throw new ExpressError(msg,404);
     }
    else{
      next();
    }
}

router.get('/',campgrounds.index);
 
 router.get('/new',isLoggedin,campgrounds.renderForm);
 
 
 
 router.get('/:id',catchAsync(campgrounds.showPage));

 router.post('/',isLoggedin,upload.array('image'),validateCampground,catchAsync(campgrounds.createNewCampground));
 
 router.get('/:id/edit',isLoggedin,catchAsync(campgrounds.editCampgroundForm))
 
 
 router.put('/:id',isLoggedin,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground));
 
 router.delete('/:id',isLoggedin,catchAsync(campgrounds.deleteCampground));


 module.exports = router;