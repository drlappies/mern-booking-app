const Appointment = require('../model/Appointment');
const Service = require('../model/Service');
const Invoice = require('../model/Invoice');
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
        next(err);
    }
}

module.exports.makeAppointment = async (req, res, next) => {
    try {
        const { appointments } = req.body;
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
        const service = await Service.findById(serviceId).populate('owner');
        const owner = service.owner._id
        const invoice = await new Invoice({
            finder: id,
            owner: owner,
            service: service,
            amount: bookings.length * service.pricing,
            appointment: newAppointments.map(el => el._id)
        })
        await invoice.save()
        res.json(newAppointments)
    } catch (err) {
        next(err)
    }
}