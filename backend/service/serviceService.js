const Service = require('../model/Service');
const Room = require('../model/Room')

module.exports.getAllServices = async () => {
    const service = await Service.find({})
    return service
}

module.exports.getAllServicesByUser = async (id) => {
    const service = await Service.find()
        .where({ owner: id })
        .populate('room')
    return service
}

module.exports.getServiceCounts = async (id) => {
    const number = await Service.find({ room: id }).countDocuments()
    return number
}

module.exports.insertService = async (id, name, room, pricing, capacity, remark) => {
    const service = new Service({
        owner: id,
        room: room,
        name: name,
        pricing: pricing,
        capacity: capacity,
        remark: remark,
        isOnline: true
    })

    const updateRoom = await Room.findById(room);
    updateRoom.services.push(service);
    await updateRoom.save()
    await service.save()

    return service
}

module.exports.getServiceById = async (id) => {
    const service = await Service.findById(id)
    return service
}

module.exports.updateService = async (id, name, pricing, capacity, remark, isOnline) => {
    const service = await Service.findByIdAndUpdate(id, {
        name: name,
        pricing: pricing,
        capacity: capacity,
        remark: remark,
        isOnline: isOnline
    }, { new: true })

    return service
}

module.exports.removeService = async (id) => {
    const service = await Service.findOneAndRemove({ _id: id });
    return service
}