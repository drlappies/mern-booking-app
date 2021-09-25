const { remove } = require('../utils/s3');
const { fetchRooms, fetchOneRoom, insertRoom, updateRoom, removeRoom } = require('../service/roomService')

module.exports.getRooms = async (req, res) => {
    try {
        const rooms = await fetchRooms()
        return res.status(200).json(rooms)
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}

module.exports.getOneRoom = async (req, res) => {
    try {
        const { id } = req.params
        const room = await fetchOneRoom(id)
        if (!room) throw new Error('查無此房間，可能已被作者或管理員刪除');
        return res.status(200).json(room)
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}

module.exports.createRoom = async (req, res) => {
    try {
        const { id } = req.user
        const { title, description, room, floor, building, street, region, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen } = req.body
        if (!id || !title || !description || !room || !floor || !building || !street || !region || !openingTime || !closingTime) {
            return res.status(400).json({
                error: '房間資料不足！'
            })
        }

        if ([isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen].every(e => e === "false")) {
            return res.status(400).json({
                error: '至少選擇一個開放日期！'
            })
        }

        const insertedRoom = await insertRoom(id, title, description, room, floor, building, street, region, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen, req.files)
        return res.status(200).json({
            success: `成功建立房間 ${insertedRoom.title}`
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}

module.exports.editRoom = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, description, addressStreet, addressBuilding, addressRegion, addressFlat, addressFloor, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen, deletedKeys, deletedImages } = req.body

        if (!title || !description || !addressStreet || !addressBuilding ||  !addressRegion ||  !addressFlat || !addressFloor || !openingTime || !closingTime) {
            return res.status(400).json({
                error: '房間資料不足！'
            })
        }

        if ([isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen].every(e => e === "false")) {
            return res.status(400).json({
                error: '至少選擇一個開放日期！'
            })

        }
        if (deletedKeys) remove(deletedKeys)

        const room = await updateRoom(id, title, description, addressStreet, addressBuilding, addressRegion, addressFlat, addressFloor, openingTime, closingTime, isMonOpen, isTuesOpen, isWedOpen, isThursOpen, isFriOpen, isSatOpen, isSunOpen, req.files, deletedImages)
        return res.status(200).json({
            success: `成功更新房間 ${room.title}`
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}

module.exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await removeRoom(id)
        const deleteImage = room.images.map(el => el.key)
        remove(deleteImage)
        return res.status(200).json({
            success: `成功移除房間 ${room.title}`
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}