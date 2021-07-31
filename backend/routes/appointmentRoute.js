const express = require('express');
const router = express.Router({ mergeParams: true });
const appointmentController = require('../controller/appointmentController');
const { isAuthorised } = require('../utils/middleware')

router.get('/', appointmentController.getAppointment);

router.post('/', isAuthorised, appointmentController.makeAppointment);

module.exports = router;