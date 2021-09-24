const express = require('express');
const router = express.Router({ mergeParams: true });
const { createReview, getOneReview, deleteOneReview, fetchReviewsByRoom } = require('../controller/reviewController');
const { isAuthorised } = require('../utils/middleware')

router.get('/', fetchReviewsByRoom);

router.post('/', isAuthorised, createReview);

router.get('/:reviewId', getOneReview);

router.delete('/:reviewId', isAuthorised, deleteOneReview);

module.exports = router;