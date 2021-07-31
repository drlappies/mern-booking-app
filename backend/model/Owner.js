const User = require('../model/User');
const mongoose = require('mongoose')
const { Schema } = mongoose

const Owner = User.discriminator('Owner', new Schema({
    title: {
        type: String,
        required: true
    },
    number: {
        type: String,
        min: 0,
        max: 8
    },
    stripe_id: {
        type: String,
        required: true
    }
}))

module.exports = Owner