const jwt = require('jsonwebtoken');
const verifyPassword = require('../utils/verifyPassword');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { obtainUser, obtainUserByUsername } = require('../service/userService')

module.exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).send('請先登入');
            } else {
                const user = await obtainUser(decoded.id)
                return res.status(200).json({
                    userid: user._id,
                    username: user.username,
                    permission: user.permission,
                    stripe_id: user.stripe_id,
                    room: user.room
                })
            }
        });
    } catch (err) {
        next(err)
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await obtainUserByUsername(username)
        if (!user) {
            return res.status(400).json({
                error: '用戶名稱或者密碼錯誤'
            })
        }

        const isPasswordValid = await verifyPassword(password, user.hash);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: '用戶名稱或者密碼錯誤'
            })
        }

        jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            return res.status(200).json({
                token: token,
                username: user.username,
                userid: user._id,
                permission: user.permission || null
            })
        })
    } catch (err) {
        next(err)
    }
}