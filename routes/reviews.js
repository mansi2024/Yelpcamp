const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const {reviewSchema} = require('../schema');
const Campground = require('../model/campground');
const Review = require('../model/review');
const reviews = require('../controllers/review');
const {isLoggedin} = require('../middleware');


const validateReview = (req,res,next)=>{
 
    const {error} = reviewSchema.validate(req.body);
   if(error){
     const msg = error.details.map(el=>el.message).join(',')
     throw new ExpressError(msg,404);
       }
      else{
        next();
      }
  }


router.delete('/:reviewId',isLoggedin,catchAsync(reviews.deleteReview));
  
router.post('/',isLoggedin, validateReview ,catchAsync(reviews.Delete));
  

  module.exports = router;