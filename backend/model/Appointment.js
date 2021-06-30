const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    time: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => {
                return (value > new Date())
            },
            message: '你有時光機嗎？'
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema);