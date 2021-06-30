const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeslotSchema = new Schema({
    slot: {
        year: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        date: {
            type: Number,
            required: true,
        },
        hour: {
            type: Number,
            required: true,
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
})

timeslotSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, '請至少提供一項服務！']
    },
    pricing: {
        type: Number,
        min: [0, '價錢不能低於零！'],
        required: [true, '價錢不能留空！']
    },
    capacity: {
        type: Number,
        min: [0, '人頭數目不能低於零！'],
        required: [true, '請提供可容人數']
    },
    remark: {
        type: String,
    },
    timeslots: [timeslotSchema]
})

module.exports = mongoose.model('Service', serviceSchema);