const express = require('express');
const router = express.Router();
const { verifyUser, loginUser } = require('../controller/authController');

router.get('/', verifyUser)

router.post('/', loginUser)

module.exports = router