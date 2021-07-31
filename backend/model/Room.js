const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('../model/Review');

const roomSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: [
        {
            type: String,
            required: true
        }
    ],
    imageKey: [
        {
            type: String,
            required: true
        }
    ],
    address: {
        street: {
            type: String,
            required: true
        },
        floor: {
            type: String,
            required: true
        },
        flat: {
            type: String,
            required: true
        },
        building: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
    },
    services: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Service',
        }
    ],
    openWeekday: {
        monday: {
            type: Boolean,
            default: true,
            required: true
        },
        tuesday: {
            type: Boolean,
            default: true,
            required: true
        },
        wednesday: {
            type: Boolean,
            default: true,
            required: true
        },
        thursday: {
            type: Boolean,
            default: true,
            required: true
        },
        friday: {
            type: Boolean,
            default: true,
            required: true
        },
        saturday: {
            type: Boolean,
            default: true,
            required: true
        },
        sunday: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    openingTime: {
        type: Number,
        required: true
    },
    closingTime: {
        type: Number,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { timestamps: true })

roomSchema.post('findOneAndDelete', async function (data) {
    await Review.deleteMany({
        _id: {
            $in: data.reviews
        }
    })
})

module.exports = mongoose.model('Room', roomSchema);