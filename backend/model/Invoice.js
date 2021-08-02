const mongoose = require('mongoose')
const { Schema } = mongoose

const invoiceSchema = new Schema({
    finder: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    appointment: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true
        }
    ]
})

module.exports = mongoose.model('Invoice', invoiceSchema)