const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controller/reviewController');
const { isLoggedIn, isReviewAuthor } = require('../utils/middleware');

router.post('/', isLoggedIn, reviewController.createReview);

router.get('/:reviewId', reviewController.getOneReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteOneReview);

module.exports = router;