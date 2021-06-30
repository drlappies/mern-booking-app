const isTimeslotAvailable = async (time) => {
    const [timeslot] = await Timeslot.find({ time: { $eq: time } });
    if (!timeslot.isAvailable) throw new Error('此時間日期已經被取！');
}

module.exports = isTimeslotAvailable