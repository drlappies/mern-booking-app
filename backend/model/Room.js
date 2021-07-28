const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('../model/Review');

const roomSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: [true, '這是誰的房？'],
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, '房間名稱不能留空！']
    },
    description: {
        type: String,
        required: [true, '房間簡介不能留空!']
    },
    imageUrl: [
        {
            type: String,
            required: [true, '請至少提供一張照片']
        }
    ],
    imageKey: [
        {
            type: String,
            required: [true, 'image key undefined']
        }
    ],
    address: {
        street: {
            type: String,
            required: [true, '街道名稱不能留空！']
        },
        floor: {
            type: String,
            required: [true, '樓層不能留空！']
        },
        flat: {
            type: String,
            required: [true, '單位/房號不能留空！']
        },
        building: {
            type: String,
            required: [true, '大廈名稱不能留空！']
        },
        region: {
            type: String,
            required: [true, '區域不能留空！']
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