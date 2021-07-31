const Room = require('../model/Room');

const isServiceAvailable = async (appointments, roomId) => {
    const result = await Room.findById(roomId);
    const hour = appointments.map(el => el.hour);
    for (let i = 0; i < hour.length; i++) {
        if (hour[i] < result.operatingTime || hour[i] > result.operatingTime) {
            throw new Error('The room may be closed during this time!');
        }
    }
}

module.exports = isServiceAvailable