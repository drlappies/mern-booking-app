const User = require('../model/User');
const mongoose = require('mongoose')
const { Schema } = mongoose

const Owner = User.discriminator('Finder', new Schema({
    title: {
        type: String,
        required: true
    },
    room: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
}))

module.exports = Owner