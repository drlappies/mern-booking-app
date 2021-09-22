const Owner = require('../model/Owner')
const Finder = require('../model/Finder')
const User = require('../model/User')

module.exports.obtainUser = async (id) => {
    const user = await User.findById(id)
        .populate('room')
        .populate({
            path: 'room',
            populate: 'services'
        });
    return user
}

module.exports.obtainUserById = async (id) => {
    const user = await User.findById(id)
        .select({ hash: 0 })
        .populate('room')
        .populate({
            path: 'room',
            populate: 'services'
        })
    return user
}

module.exports.obtainUserByUsername = async (username) => {
    const user = await User.findOne({ username: username })
    return user
}

module.exports.createFinderUser = async (username, hashedPassword, name) => {
    const user = new Finder({
        username: username,
        hash: hashedPassword,
        name: name
    })

    await user.save()
    return user
}

module.exports.createOwnerUser = async (username, hashedPassword, title, stripeId) => {
    const user = new Owner({
        username: username,
        hash: hashedPassword,
        title: title,
        stripe_id: stripeId
    })

    await user.save()
    return user
}