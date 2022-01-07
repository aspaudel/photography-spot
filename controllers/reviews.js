const Photoground = require('../models/photoground');
const Review = require('../models/review');

module.exports.create = async(req, res) => {
    const photoground = await Photoground.findById(req.params.id);
    const review = new Review(req.body.review); 
    review.author = req.user._id;
    photoground.reviews.push(review);
    await review.save();  
    await photoground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/photogrounds/${photoground._id}`);
}

module.exports.delete = async(req, res) => {
    const{id, reviewId} = req.params;
    await Photoground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted a review!");
    res.redirect(`/photogrounds/${id}`);
}