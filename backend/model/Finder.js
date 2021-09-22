const User = require('../model/User');
const mongoose = require('mongoose')
const { Schema } = mongoose

const Finder = User.discriminator('Finder', new Schema({
    name: { type: String, required: true },
    number: { type: String, min: 0, max: 8 },
}))

module.exports = Finder