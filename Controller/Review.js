const Station = require('../models/Stations');
const Review = require('../models/Reviews')


module.exports.createReview = async (req,res)=>{
    const station = await Station.findById(req.params.id)
    const review = new Review(req.body.reviews)
    review.author =  req.session.user_id
    station.reviews.push(review);
    await review.save();
    await station.save() 
    req.flash('success','Thanks for review')
    res.redirect(`/station/${station._id}`)
}


module.exports.deleteReview = async (req,res)=>{
    const { id,reviewId } = req.params;
    await Station.findByIdAndUpdate(id)
    await Review.findByIdAndDelete(reviewId)
    req.flash('error','Review Deleted')


    res.redirect(`/station/${id}`)
}