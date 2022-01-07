const Photoground = require('../models/photoground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const photogrounds = await Photoground.find({});
    res.render('photogrounds/index', { photogrounds });
}

module.exports.renderNewForm = async(req, res) => {
    res.render('photogrounds/new');
}

module.exports.showPhotoground = async (req, res) => {
    const photoground = await Photoground.findById(req.params.id).populate ({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!photoground) {
        req.flash('error', 'Cannot find the photogorund!');
        return res.redirect('/photogrounds');
    }
    res.render('photogrounds/show', { photoground });
    console.log(photoground);
}

module.exports.createPhotoground = async (req, res, next) => {
    //if(!req.body.photoground) throw new ExpressError('Invalid Photoground Data', 400);
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.photoground.location,
        limit: 1
    }).send();
    const photoground = new Photoground(req.body.photoground);
    photoground.geometry = geoData.body.features[0].geometry;
    photoground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    photoground.author = req.user._id;
    await photoground.save();
    console.log(photoground);
    req.flash('success', 'Successfully made a new photoground!');
    res.redirect(`/photogrounds/${photoground._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const photoground = await Photoground.findById(id);
    if(!photoground) {
        req.flash('error', 'Cannot find the photogorund!');
        return res.redirect('/photogrounds');
    }
    res.render('photogrounds/edit', { photoground });
}

module.exports.updatePhotoground = async (req, res) => {
    const { id } = req.params;
    const photoground = await Photoground.findByIdAndUpdate(id, { ...req.body.photoground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    photoground.images.push(...imgs);
    await photoground.save(); 
    console.log(req.body);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await photoground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log("Here"+ photoground);
    }
    req.flash('success', "Successfully updated photogorund!");
    res.redirect(`/photogrounds/${photoground._id}`);
}

module.exports.deletePhotoground = async (req, res) => {
    const { id } = req.params;
    await Photoground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted a photoground!");
    res.redirect('/photogrounds');
}