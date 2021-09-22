const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAppointments, makeAppointment, getInvoices, getAppointment } = require('../controller/appointmentController');
const { isAuthorised } = require('../utils/middleware')

router.get('/:roomid/room/:serviceid/service', getAppointments);
router.get('/:id', getAppointment)
router.post('/', isAuthorised, makeAppointment);

module.exports = router;