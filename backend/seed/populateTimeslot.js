const mongoose = require('mongoose');
const moment = require('moment');
const Timeslot = require('../model/Timeslot');
mongoose.connect('mongodb://localhost:27017/practice-room-rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const currentTime = moment();
const startTime = currentTime.clone().startOf('date');
const endTime = currentTime.clone().startOf('day').add(1, 'month');
const duration = moment.duration(endTime.diff(startTime)).asHours();

async function populateTimeslot() {
    await Timeslot.deleteMany();
    const timeslots = [];
    for (let i = 0; i < duration; i++) {
        let slot = startTime.clone().add(i, 'hour').toISOString();
        timeslots.push(slot);
    }
    timeslots.forEach(async (el) => {
        let date = new Date(el);
        let expiryDate = date.setDate(date.getDate() + parseInt(1));
        const timeslot = new Timeslot({
            slot: {
                year: new Date(el).getFullYear(),
                month: new Date(el).getMonth() + 1,
                date: new Date(el).getDate(),
                hour: new Date(el).getHours(),
            },
            isAvailable: true,
            expireAt: expiryDate
        })
        await timeslot.save();
    })
}

module.exports = populateTimeslot;