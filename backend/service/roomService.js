const Room = require('../model/Room');
const User = require('../model/User');

module.exports.fetchRooms = async () => {
    const rooms = await Room.find({})
        .populate('owner', '-createdAt -updatedAt -hash -room -stripe_id -updatedAt -username -permission -__v -_id')
    return rooms
}

module.exports.fetchOneRoom = async (id) => {
    const room = await Room.findById(id)
        .populate('reviews')
        .populate({ path: 'reviews', populate: 'author' })
        .populate({
            path: 'services',
            model: 'Service',
            match: { isOnline: true }
        })
    return room
}

module.exports.insertRoom = async (id, title, description, room, floor, building, street, region, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen, images) => {
    const user = await User.findById(id)
    const newRoom = new Room({
        owner: user,
        title: title,
        description: description,
        address: {
            street: street,
            floor: floor,
            flat: room,
            building: building,
            region: region,
        },
        openWeekday: {
            monday: isMonOpen,
            tuesday: isTuesOpen,
            wednesday: isWedOpen,
            thursday: isThursOpen,
            friday: isFriOpen,
            saturday: isSatOpen,
            sunday: isSunOpen
        },
        openingTime: openingTime,
        closingTime: closingTime,
    })

    images.forEach(el => {
        newRoom.images.push({
            url: el.location,
            key: el.key
        })
    })

    user.room.push(newRoom)
    await user.save()
    await newRoom.save()

    return newRoom
}

module.exports.updateRoom = async (id, title, description, addressStreet, addressBuilding, addressRegion, addressFlat, addressFloor, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen, uploadedImage, deletedImage) => {
    if (!Array.isArray(deletedImage)) deletedImage = [deletedImage]
    let room = await Room.findByIdAndUpdate(id, {
        title: title,
        description: description,
        address: {
            street: addressStreet,
            floor: addressFloor,
            flat: addressFlat,
            building: addressBuilding,
            region: addressRegion
        },
        openWeekday: {
            monday: isMonOpen,
            tuesday: isTuesOpen,
            wednesday: isWedOpen,
            thurdsay: isThursOpen,
            friday: isFriOpen,
            saturday: isSatOpen,
            sunday: isSunOpen
        },
        openingTime: openingTime,
        closingTime: closingTime,
    }, { new: true, omitUndefined: true })

    if (deletedImage.length > 0 && uploadedImage.length > 0) {
        deletedImage.forEach(async (el, i) => {
            const room = await Room.findById(id);
            const image = room.images.id(el)
            image.url = uploadedImage[i].location
            image.key = uploadedImage[i].key

            await room.save()
        })
    }

    return room
}

module.exports.removeRoom = async (id) => {
    const room = await Room.findByIdAndDelete(id)
    return room
}

module.exports.getAllRoomsByUser = async (id) => {
    const room = await Room.find({ owner: id }).populate('services')
    return room
}