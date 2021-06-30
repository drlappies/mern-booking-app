const Appointment = require('../model/Appointment');
const Room = require('../model/Room');

const isServiceAvailable = async (roomId, serviceId, timeslot) => {
    const isAvailable = await Appointment.find({ $and: [{ timeslot: { $eq: timeslot } }, { service: { $eq: serviceId } }] });
    // check if the desired time slot for this service already has appointment
    const room = await Room.findById(roomId);
    if (isAvailable.length)
        throw new Error('此日期時間已有預約'); // if the array is true means an existing booking is found, reject request.
    if (new Date(timeslot).getHours() < room.openingHour || new Date(timeslot).getHours() > room.closingHour)
        throw new Error('尚未開門或已經關門！');
}

module.exports = isServiceAvailable