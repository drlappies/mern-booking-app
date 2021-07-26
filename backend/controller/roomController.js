const Room = require('../model/Room');
const Service = require('../model/Service');
const { imageDestroy } = require('../utils/s3');

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
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, title, description, street, floor, flat, building, region, openingTime, closingTime } = req.body
        const newRoom = new Room({
            owner: req.user.id,
            title: title,
            description: description,
            address: {
                street: street,
                floor: floor,
                flat: flat,
                building: building,
                region: region,
            },
            openWeekday: {
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday
            },
            openingTime: openingTime,
            closingTime: closingTime
        });
        req.files.forEach(el => {
            newRoom.imageUrl.push(el.location);
            newRoom.imageKey.push(el.key)
        })
        await newRoom.save()
        res.json(newRoom)
    } catch (err) {
        next(err)
    }
}

module.exports.editRoom = async (req, res, next) => {
    try {
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, title, description, street, floor, flat, building, region, openingTime, closingTime, deletedImages } = req.body
        const { id } = req.params
        const updateRoom = await Room.findByIdAndUpdate(id, {
            owner: req.user.id,
            title: title,
            description: description,
            address: {
                street: street,
                floor: floor,
                flat: flat,
                building: building,
                region: region,
            },
            openWeekday: {
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday,
                sunday: sunday
            },
            openingTime: openingTime,
            closingTime: closingTime
        }, { new: true })
        if (req.files) {
            req.files.forEach(el => {
                updateRoom.imageUrl.push(el.location);
                updateRoom.imageKey.push(el.key)
            })
        }
        if (deletedImages) {
            const deletekeys = JSON.parse(deletedImages).map(el => ({ Key: el.key }));
            const urls = JSON.parse(deletedImages).map(el => el.url);
            const keys = JSON.parse(deletedImages).map(el => el.key);
            imageDestroy(deletekeys);
            await updateRoom.updateOne({ $pull: { imageKey: { $in: keys } } })
            await updateRoom.updateOne({ $pull: { imageUrl: { $in: urls } } })
        }
        res.json(updateRoom)
    } catch (err) {
        next(err)
    }
}

module.exports.roomManagement = async (req, res, next) => {
    try {
        const { id } = req.user;
        const rooms = await Room.find({})
            .populate('services')
            .where('owner').equals(id)
        res.json(rooms)
    } catch (err) {
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