const Appointment = require('../model/Appointment');

const isTimeslotAvailable = async (appointments) => {
    const year = appointments.map(el => el.year);
    const month = appointments.map(el => el.month);
    const date = appointments.map(el => el.date);
    const hour = appointments.map(el => el.hour);
    const service = appointments.map(el => el.service);
    const room = appointments.map(el => el.room);
    const [result] = await Appointment.find({
        $and: [
            { service: { $in: service } },
            { room: { $in: room } },
            { year: { $in: year } },
            { month: { $in: month } },
            { date: { $in: date } },
            { hour: { $in: hour } },
        ]
    })
    if (result) throw new Error('Either one timeslot or all has been taken！');
}

module.exports = isTimeslotAvailable