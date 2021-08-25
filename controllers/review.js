const Campground = require('../model/campground');
const Review = require('../model/review');

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that');
      return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id ,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`)
  }
  module.exports.Delete = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review.')
    res.redirect(`/campgrounds/${campground._id}`)
  }