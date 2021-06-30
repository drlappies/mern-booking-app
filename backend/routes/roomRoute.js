const express = require('express');
const router = express.Router()
const roomController = require('../controller/roomController');
const { upload } = require('../utils/s3');
const { isLoggedIn, isRoomOwner } = require('../utils/middleware')

router.get('/', roomController.getRooms);

router.post('/', isLoggedIn, isRoomOwner, upload.single('image'), roomController.createRoom);

router.get('/:id', roomController.getOneRoom);

router.put('/:id', isLoggedIn, isRoomOwner, upload.single('image'), roomController.editRoom);

router.delete('/:id', isLoggedIn, isRoomOwner, roomController.deleteRoom);

module.exports = router
