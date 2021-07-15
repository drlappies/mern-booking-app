const Room = require('../model/Room');
const Service = require('../model/Service');
const { imageDestroy } = require('../utils/s3')

module.exports.getRooms = async (req, res) => {
    try {
        const allRooms = await Room.find()
            .populate('owner')
        res.json(allRooms)
    } catch {
        res.status(404)
        const error = new Error('查無此房間，可能已被作者或管理員刪除')
        next(error)
    }
}

module.exports.getOneRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('reviews')
            .populate({
                path: 'reviews',
                populate: 'author'
            })
            .populate({
                path: 'services',
                model: Service
            })
        if (!room) throw new Error('查無此房間，可能已被作者或管理員刪除');
        res.json(room);
    } catch (err) {
        res.status(404)
        next(err)
    }
}

module.exports.createRoom = async (req, res, next) => {
    try {
        const newRoom = new Room(req.body);
        newRoom.image.imageUrl.push(req.file.location);
        newRoom.image.imageKey.push(req.file.key);
        await newRoom.save()
        res.json(newRoom)
    } catch (err) {
        res.status(422)
        next(err)
    }
}

module.exports.editRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.file) {
            const imageKey = updatedRoom.image.imageKey[0];
            imageDestroy(imageKey);
            updatedRoom.image.imageKey = [];
            updatedRoom.image.imageUrl = [];
            updatedRoom.image.imageUrl.push(req.file.location);
            updatedRoom.image.imageKey.push(req.file.key);
        }
        await updatedRoom.save();
        res.json(updatedRoom)
    } catch (err) {
        res.status(422)
        next(err)
    }
}

module.exports.deleteRoom = async (req, res, next) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id)
        const imageKey = deletedRoom.image.imageKey[0];
        imageDestroy(imageKey);
        res.json(deletedRoom)
    } catch (err) {
        res.status(404)
        next(err)
    }
}