const express = require('express');
const router = express.Router();
const { isAuthorised } = require('../utils/middleware');
const { onboard, getOnboardStatus, getPaymentIntent, getInvoices, getOneInvoice } = require('../controller/transactionController');

router.get('/onboard', isAuthorised, onboard)

router.get('/onboardstatus', isAuthorised, getOnboardStatus)

router.post('/intent', isAuthorised, getPaymentIntent)

router.get('/invoices', isAuthorised, getInvoices)

router.post('/invoice', isAuthorised, getOneInvoice)

module.exports = router