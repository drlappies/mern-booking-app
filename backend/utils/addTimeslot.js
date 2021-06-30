const Timeslot = require('../model/Timeslot');
const moment = require('moment');
const currentTime = moment();
const addTime = currentTime.clone().startOf('day').add(1, 'month').add(1, 'day'); // last day of the timeslots + 1 day;

const addTimeslot = async () => {
    let date = new Date(addTime);
    let expiryDate = date.setDate(date.getDate() + parseInt(1));
    const newTimeslot = new Timeslot({
        slot: {
            year: new Date(addTime).getFullYear(),
            month: new Date(addTime).getMonth() + 1,
            date: new Date(addTime).getDate(),
            hour: new Date(addTime).getHours()
        },
        isAvailable: true,
        expireAt: expiryDate
    })
    await newTimeslot.save()
    setTimeout(async () => {
        await addTimeslot()
    }, 24 * 60 * 60 * 1000)
}

module.exports = addTimeslot;