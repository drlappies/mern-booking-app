const { fetchAppointments, createAppointment, checkTimeslotAvailability, checkServiceAvailability, fetchAppointment } = require('../service/appointmentService')
const { obtainUserById } = require('../service/userService')

module.exports.getAppointments = async (req, res, next) => {
    try {
        const { roomid, serviceid } = req.params;
        const appointments = await fetchAppointments(roomid, serviceid)
        return res.status(200).json(appointments)
    } catch (err) {
        next(err);
    }
}

module.exports.getAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await fetchAppointment(id)
        return res.status(200).json(appointment)
    } catch (err) {
        next(err)
    }
}

module.exports.makeAppointment = async (req, res, next) => {
    try {
        const { appointments, roomId, serviceId } = req.body;
        const { id } = req.user;

        const user = await obtainUserById(id)
        if (user.permission !== 'Finder') {
            return res.status(400).json({
                error: 'Owner not allowed to make appointments.'
            })
        }
        if (appointments.length > 5) {
            return res.status(400).json({
                error: 'Exceeded booking limit'
            })
        }
        const currentTime = new Date();
        appointments.forEach(el => {
            if (currentTime.getFullYear() >= el.year && currentTime.getMonth() + 1 >= el.month && currentTime.getDate() >= el.date && currentTime.getHours() >= el.hour) {
                return res.status(400).json({
                    error: 'Cannot time travel.'
                })
            }
        })
        const timeslots = await checkTimeslotAvailability(appointments)
        if (timeslots.length > 0) {
            return res.status(400).json({
                error: 'Timeslot taken'
            })
        }
        if (await checkServiceAvailability(appointments, roomId)) {
            return res.status(400).json({
                error: 'Room not open yet.'
            })
        }
        const newAppointments = await createAppointment(id, roomId, serviceId, appointments)
        return res.status(200).json({
            success: '預訂成功！'
        })
    } catch (err) {
        next(err)
    }
}