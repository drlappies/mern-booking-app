require('dotenv').config
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Owner = require('../model/Owner')
const jwt = require('jsonwebtoken');
const hashingPassword = require('../utils/hashingPassword');
const verifyPassword = require('../utils/verifyPassword');

router.get('/', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).send('請先登入')
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).send('請先登入');
            } else {
                const user = await User.findById(decoded.id);
                res.json(user)
            }
        });
    } catch (err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const { username, password, permission, title } = req.body;
        if (!username || !password || !permission) {
            return res.status(400).send('用戶名稱或密碼不能留空！')
        }
        const user = await User.findOne({ username: username })
        if (user) {
            return res.status(400).send('用戶名稱已經被取')
        }
        const hash = await hashingPassword(password);
        if (permission === 'finder') {
            const user = new User({
                username: username,
                hash: hash,
            })
            await user.save();
            jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) throw new Error(err);
                res.json({ token: token });
            })
        } else if (permission === 'owner') {
            const user = new Owner({
                username: username,
                hash: hash,
                title: title
            })
            await user.save();
            jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) throw new Error(err);
                res.json({ token: token });
            })
        }
    } catch (err) {
        next(err);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(401).send('用戶名稱或者密碼錯誤')
        }
        const isPasswordValid = await verifyPassword(password, user.hash);
        if (!isPasswordValid) {
            return res.status(401).send('用戶名稱或者密碼錯誤')
        }
        jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
            if (err) throw new Error(err);
            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username
                }
            });
        })
    } catch (err) {
        next(err)
    }
})

router.post('/logout', (req, res) => {
    req.logout();
    res.json({
        message: '你已成功登出'
    })
})

module.exports = router