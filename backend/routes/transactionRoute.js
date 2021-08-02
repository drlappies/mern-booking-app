const express = require('express');
const router = express.Router();
const { isAuthorised } = require('../utils/middleware');
const { onboard, getOnboardStatus, getPaymentIntent, getInvoices } = require('../controller/transactionController');

router.get('/onboard', isAuthorised, onboard)

router.get('/onboardstatus', isAuthorised, getOnboardStatus)

router.post('/intent', isAuthorised, getPaymentIntent)

router.get('/invoices', isAuthorised, getInvoices)

module.exports = router