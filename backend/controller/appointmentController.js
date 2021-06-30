const Appointment = require('../model/Appointment');
const Service = require('../model/Service');
const Room = require('../model/Room');
const isServiceAvailable = require('../utils/isServiceAvailable');
const isTimeslotAvailable = require('../utils/isTimeslotAvailable');

module.exports.getAppointment = async (req, res, next) => {
    try {
        const obj = await Room.findById(req.params.roomId).select('operatingHour');
        const { openingTime, closingTime } = obj.operatingHour
        console.log(openingTime)
        console.log(closingTime)
        const timeslots = await Service.findOne({
            _id: { $eq: req.params.serviceId },
            timeslots: { slot: { date: { $and: [{ $gte: openingTime }, { $lte: closingTime }] } } }
        });
        res.json(timeslots);
    } catch (err) {
        res.status(404)
        next(err);
    }
}

module.exports.makeAppointment = async (req, res, next) => {
    try {
        const { time } = req.body; //timeslot is an ISOString
        const newAppointment = new Appointment({
            time: time,
            service: req.params.serviceId,
            room: req.params.id,
        })
        await isTimeslotAvailable(time);
        await isServiceAvailable(req.params.roomId, req.params.serviceId, time);
        await newAppointment.save();
        res.json({
            status: 'posted',
            appointment: newAppointment
        })
    } catch (err) {
        res.status(403)
        next(err)
    }
}