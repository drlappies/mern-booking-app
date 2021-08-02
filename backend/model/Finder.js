const User = require('../model/User');
const mongoose = require('mongoose')
const { Schema } = mongoose

const Finder = User.discriminator('Finder', new Schema({
    invoice: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Invoice'
        }
    ]
}))

module.exports = Finder