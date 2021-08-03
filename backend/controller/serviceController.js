const Service = require('../model/Service');
const Room = require('../model/Room')

module.exports.createService = async (req, res, next) => {
    try {
        const { name, pricing, capacity, remark, room } = req.body;
        if (!name || !pricing || !capacity || !remark || !room) {
            return res.status(400).send('資料不足')
        }
        const service = new Service({
            owner: req.user.id,
            room: room,
            name: name,
            pricing: pricing,
            capacity: capacity,
            remark: remark,
            isOnline: true
        })
        const updateRoom = await Room.findById(room);
        updateRoom.services.push(service);
        await updateRoom.save();
        await service.save();
        res.json(service);
    } catch (err) {
        next(err)
    }
}

module.exports.getService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        res.json(service);
    } catch (err) {
        next(err)
    }
}

module.exports.editService = async (req, res, next) => {
    try {
        const { name, pricing, capacity, remark, isOnline } = req.body;
        const { id } = req.params;
        const service = await Service.findByIdAndUpdate(id, {
            name: name,
            pricing: pricing,
            capacity: capacity,
            remark: remark,
            isOnline: isOnline
        }, { new: true })
        res.json({
            id: service._id,
            name: service.name,
            pricing: service.pricing,
            remark: service.remark,
            isOnline: service.isOnline
        })
    } catch (err) {
        next(err)
    }
}

module.exports.deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findOneAndRemove({ _id: id });
        res.json({
            name: service.name,
            pricing: service.pricing,
            remark: service.remark,
            isOnline: service.isOnline
        })
    } catch (err) {
        next(err)
    }
}