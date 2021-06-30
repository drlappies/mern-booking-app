const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../model/User');
const Room = require('../model/Room');

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reviewBody: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
}, { timestamps: true })

reviewSchema.post('findOneAndDelete', async function (data) {
    await User.findByIdAndUpdate(data.author, {
        $pull: {
            reviews: {
                $in: data._id
            }
        }
    })

    await Room.findByIdAndUpdate(data.room, {
        $pull: {
            reviews: {
                $in: data._id
            }
        }
    })
})

module.exports = mongoose.model('Review', reviewSchema);