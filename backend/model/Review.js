const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    room: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
    body: { type: String, required: true, },
    rating: { type: Number, min: 0, max: 5 },
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema);