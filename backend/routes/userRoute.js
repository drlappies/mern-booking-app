const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');
const hashingPassword = require('../utils/hashingPassword');

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const { hash, salt } = await hashingPassword(password);
        const newUser = new User({
            ...req.body,
            username: username,
            hash: hash,
            salt: salt
        })
        await newUser.save();
        passport.authenticate('local')(req, res, () => {
            res.json({
                message: `你好！${req.user.username}`
            })
        })
    } catch (err) {
        next(err);
    }
})

router.post('/login', passport.authenticate('local'),
    function (req, res) {
        res.json({
            message: 'logged'
        })
    }
)

router.post('/logout', (req, res) => {
    req.logout();
    res.json({
        message: '你已成功登出'
    })
})

module.exports = router