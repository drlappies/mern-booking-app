const mongoose = require('mongoose');
const { Schema } = mongoose;
const Room = require('../model/Room');

const serviceSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    pricing: { type: Number, min: 0, required: true },
    capacity: { type: Number, min: 0, required: true },
    remark: { type: String, },
    isOnline: { type: Boolean, required: true }
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