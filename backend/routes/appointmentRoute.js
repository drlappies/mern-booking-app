const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAppointment, makeAppointment, getInvoices } = require('../controller/appointmentController');
const { isAuthorised } = require('../utils/middleware')

router.get('/', getAppointment);

router.post('/', isAuthorised, makeAppointment);

module.exports = router;