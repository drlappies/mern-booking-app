const User = require('../model/User');
const mongoose = require('mongoose')
const { Schema } = mongoose

const Finder = User.discriminator('Finder', new Schema({

}))

module.exports = Finder