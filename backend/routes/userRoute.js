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
            const { isAdmin, isRoomOwner, fullName, username } = req.user;
            res.json({
                isAdmin: isAdmin,
                isRoomOwner: isRoomOwner,
                fullName: fullName,
                username: username
            })
        })
    } catch (err) {
        next(err);
    }
})

router.post('/login', passport.authenticate('local'),
    function (req, res) {
        const { isAdmin, isRoomOwner, fullName, username } = req.user;
        res.json({
            isAdmin: isAdmin,
            isRoomOwner: isRoomOwner,
            fullName: fullName,
            username: username
        })
    }
)

router.post('/logout', (req, res) => {
    req.logout();
    res.json({
        message: '你已成功登出'
    })
})

router.get('/currentuser', (req, res) => {
    if (req.user) {
        const { isAdmin, isRoomOwner, fullName, username } = req.user;
        res.json({
            isAdmin: isAdmin,
            isRoomOwner: isRoomOwner,
            fullName: fullName,
            username: username
        });
    } else {
        res.end()
    }
})

module.exports = router