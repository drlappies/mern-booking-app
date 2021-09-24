const express = require('express');
const router = express.Router()
const roomController = require('../controller/roomController');
const { upload } = require('../utils/s3');
const { isAuthorised } = require('../utils/middleware');

router.get('/', roomController.getRooms);

router.post('/', isAuthorised, upload.array('image', 5), roomController.createRoom);

router.get('/:id', roomController.getOneRoom)

router.put('/:id', isAuthorised, upload.array('image', 5), roomController.editRoom);

router.delete('/:id', isAuthorised, roomController.deleteRoom);

module.exports = router
