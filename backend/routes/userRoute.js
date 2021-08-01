const express = require('express');
const router = express.Router();
const { isAuthorised } = require('../utils/middleware');
const { getUser, registerUser, loginUser } = require('../controller/userController');

router.get('/', getUser)

router.post('/register', registerUser)

router.post('/login', loginUser)

module.exports = router