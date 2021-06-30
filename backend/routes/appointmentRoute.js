const express = require('express');
const router = express.Router({ mergeParams: true });
const appointmentController = require('../controller/appointmentController');
const { isLoggedIn } = require('../utils/middleware');

router.get('/', appointmentController.getAppointment);

router.post('/', appointmentController.makeAppointment);

module.exports = router;