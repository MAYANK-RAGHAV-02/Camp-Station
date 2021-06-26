const Review = require('./models/Reviews');
const Station = require('./models/Stations')
 


module.exports.valid = async (req,res,next)=>{
    const {id} = req.params;
    const user = req.session.user_id;
    const found = await Station.findById(id)
    if(!found.author.equals(user._id)){
         req.flassh('error','Not allowed')
        return res.redirect('/station')
    }
    next();
}


module.exports.validReview = async (req,res,next)=>{
    const {reviewId} = req.params;
    const user = req.session.user_id;
    const found = await Review.findById(reviewId)
    if(!found.author.equals(user._id)){
        req.flassh('error','Not allowed')
        return res.redirect('/station')    }
    next();
}


module.exports.loginStrict =  (req,res,next)=>{
    if(!req.session.user_id){
        req.flash('error','Make sure you loged In')
        return res.redirect('/login')
    }
    next();
}