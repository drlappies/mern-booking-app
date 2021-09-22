const Appointment = require('../model/Appointment');
const Service = require('../model/Service');
const Invoice = require('../model/Invoice');
const Room = require('../model/Room')

module.exports.fetchAppointments = async (roomId, serviceId) => {
    const appointments = await Appointment.find({
        $and: [
            { service: serviceId },
            { room: roomId }
        ]
    }, { user: 0, createdAt: 0, updatedAt: 0, invoice: 0, room: 0, service: 0, __v: 0, _id: 0 })

    return appointments
}

module.exports.fetchAppointment = async (id) => {
    const [appointment] = await Appointment.find({ _id: id })
        .select('-date -hour -month -room -updatedAt -createdAt -year -updatedAt -user -__v -_id')
        .populate({
            path: 'service',
            model: 'Service',
            select: { _id: 0, __v: 0, capacity: 0, isOnline: 0, owner: 0, remark: 0, room: 0 }
        })
        .populate({
            path: 'invoice',
            select: { updatedAt: 0, owner: 0, service: 0, __v: 0, },
            populate: {
                path: 'appointment',
                model: 'Appointment',
                select: { room: 0, service: 0, user: 0, invoice: 0, createdAt: 0, updatedAt: 0, _id: 0, __v: 0 }
            },
        })
        .populate({
            path: 'invoice',
            select: { updatedAt: 0, owner: 0, service: 0, __v: 0, },
            populate: {
                path: 'finder',
                model: 'Finder',
                select: { hash: 0, username: 0, createdAt: 0, updatedAt: 0, permission: 0, __v: 0, _id: 0 }
            }
        })

    return appointment
}

module.exports.createAppointment = async (userId, roomId, serviceId, appointments) => {
    const service = await Service.findById(serviceId).populate('owner')

    const invoice = await new Invoice({
        finder: userId,
        owner: service.owner,
        service: service,
        amount: appointments.length * service.pricing,
    })

    const bookings = appointments.map(el => ({
        user: userId,
        service: serviceId,
        invoice: invoice._id,
        room: roomId,
        year: el.year,
        month: el.month,
        date: el.date,
        hour: el.hour
    }))
    const newAppointments = await Appointment.insertMany(bookings)
    invoice.appointment = newAppointments.map(el => el.id)

    await invoice.save()

    return newAppointments
}

module.exports.checkTimeslotAvailability = async (appointments) => {
    const year = appointments.map(el => el.year);
    const month = appointments.map(el => el.month);
    const date = appointments.map(el => el.date);
    const hour = appointments.map(el => el.hour);
    const service = appointments.map(el => el.service);
    const room = appointments.map(el => el.room);
    const result = await Appointment.find({
        $and: [
            { service: { $in: service } },
            { room: { $in: room } },
            { year: { $in: year } },
            { month: { $in: month } },
            { date: { $in: date } },
            { hour: { $in: hour } },
        ]
    })

    return result
}

module.exports.checkServiceAvailability = async (appointments, roomId) => {
    const result = await Room.findById(roomId);
    const hour = appointments.map(el => el.hour);
    for (let i = 0; i < hour.length; i++) {
        if (hour[i] < result.operatingTime || hour[i] > result.operatingTime) {
            return true
        } else {
            return false
        }
    }
}