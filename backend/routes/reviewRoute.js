const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controller/reviewController');

router.post('/', reviewController.createReview);

router.get('/:reviewId', reviewController.getOneReview);

router.delete('/:reviewId', reviewController.deleteOneReview);

module.exports = router;