const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    timeslot: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        date: {
            type: Number,
            required: true
        },
        hour: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema);