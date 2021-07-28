const mongoose = require('mongoose');
const { Schema } = mongoose;
const Room = require('../model/Room');

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, '請至少提供一項服務！']
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
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
    isOnline: {
        type: Boolean,
        required: true
    }
})

serviceSchema.post('findOneAndDelete', async function (data) {
    await Room.findByIdAndUpdate(data.room, {
        $pull: {
            services: {
                $in: data._id
            }
        }
    })
})

module.exports = mongoose.model('Service', serviceSchema);