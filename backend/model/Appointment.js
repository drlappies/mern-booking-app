const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
    date: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    hour: {
        type: Number,
        required: true,
        min: 0, 
        max: 24
    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema);