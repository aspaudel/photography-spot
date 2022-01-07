const ExpressError = require('./utils/ExpressError');
const {photogroundSchema, reviewSchema} = require('./schemas.js');
const Photoground = require('./models/photoground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be signed in");
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const photoground = await Photoground.findById(id);
    if(!photoground.author.equals(req.user._id)) {
        req.flash('error', "You do have the permission to do that!");
        return res .redirect(`/photogrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You do have the permission to do that!");
        return res .redirect(`/photogrounds/${id}`);
    }
    next();
}

module.exports.validatePhotoground = (req, res, next) => {
    const {error} = photogroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}