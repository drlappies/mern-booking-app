const Appointment = require('../model/Appointment');
const Service = require('../model/Service');
const Owner = require('../model/Owner');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const isServiceAvailable = require('../utils/isServiceAvailable');
const isTimeslotAvailable = require('../utils/isTimeslotAvailable');
const verifyPricing = require('../utils/verifyPricing');

module.exports.getAppointment = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({
            $and: [
                { service: req.params.serviceId },
                { room: req.params.roomId },
            ]
        })
        res.json(appointments)
    } catch (err) {
        next(err);
    }
}

module.exports.makeAppointment = async (req, res, next) => {
    try {
        const { appointments, pricing } = req.body;
        const { id } = req.user;
        const { roomId, serviceId } = req.params;
        if (appointments.length > 5) throw new Error('Exceeded booking limited')
        await isTimeslotAvailable(appointments);
        await isServiceAvailable(appointments, roomId);
        const bookings = appointments.map(el => ({
            user: id,
            service: serviceId,
            room: roomId,
            year: el.year,
            month: el.month,
            date: el.date,
            hour: el.hour
        }))
        
        const newAppointments = await Appointment.insertMany(bookings);
        res.json(newAppointments)
    } catch (err) {
        next(err)
    }
}