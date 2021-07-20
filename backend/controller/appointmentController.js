const Appointment = require('../model/Appointment');
const Service = require('../model/Service');
const Room = require('../model/Room');
const isServiceAvailable = require('../utils/isServiceAvailable');
const isTimeslotAvailable = require('../utils/isTimeslotAvailable');

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
        res.status(404)
        next(err);
    }
}

module.exports.makeAppointment = async (req, res, next) => {
    try {
        const { appointments } = req.body;
        if (appointments.length > 5) throw new Error('Exceeded booking limited')
        const { roomId } = req.params;
        await isTimeslotAvailable(appointments);
        await isServiceAvailable(appointments, roomId);
        const newAppointments = await Appointment.insertMany(appointments);
        res.json(newAppointments)
    } catch (err) {
        res.status(403)
        next(err)
    }
}