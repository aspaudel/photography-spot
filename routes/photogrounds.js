const express = require('express');
const router = express.Router();
const photogrounds = require('../controllers/photogrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validatePhotoground} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(photogrounds.index))
    .post(isLoggedIn, upload.array('image'), validatePhotoground, catchAsync(photogrounds.createPhotoground));

router.get('/new', isLoggedIn, photogrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(photogrounds.showPhotoground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePhotoground, catchAsync(photogrounds.updatePhotoground))
    .delete(isLoggedIn, isAuthor, catchAsync(photogrounds.deletePhotoground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(photogrounds.renderEditForm));

module.exports = router;