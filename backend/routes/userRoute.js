const express = require('express');
const router = express.Router();
const { isAuthorised } = require('../utils/middleware')
const { registerFinder, registerOwner, getUserById, getRoomsByUser, getServicesByUser } = require('../controller/userController')

router.get('/', isAuthorised, getUserById)
router.get('/:id/room', isAuthorised, getRoomsByUser)
router.get('/:id/service', isAuthorised, getServicesByUser)
router.post('/finder', registerFinder)
router.post('/owner', registerOwner)

module.exports = router