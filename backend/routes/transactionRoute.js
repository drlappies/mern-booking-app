const express = require('express');
const router = express.Router();
const { isAuthorised } = require('../utils/middleware');
const { onboard, getOnboardStatus, getPaymentIntent } = require('../controller/transactionController');

router.get('/:id/onboard', isAuthorised, onboard)
router.get('/:id/status', isAuthorised, getOnboardStatus)
router.post('/', isAuthorised, getPaymentIntent)

module.exports = router