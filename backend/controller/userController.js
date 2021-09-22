const jwt = require('jsonwebtoken');
const hashingPassword = require('../utils/hashingPassword');
const verifyPassword = require('../utils/verifyPassword');
const regExpCheck = require('../utils/regExpCheck');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { obtainUserByUsername, createFinderUser, createOwnerUser, obtainUserById } = require('../service/userService')
const { getAllRoomsByUser } = require('../service/roomService')
const { getAllServicesByUser } = require('../service/serviceService')

module.exports.registerFinder = async (req, res, next) => {
    try {
        const { username, password, confirmPassword, name } = req.body;

        if (!username || !password || !name || !confirmPassword) {
            return res.status(400).json({
                error: '用戶名稱或密碼不能留空！'
            })
        }

        if (regExpCheck(username)) {
            return res.status(400).json({
                error: '用戶名稱不能有特殊符號或空白！'
            })
        }

        const userByUsername = await obtainUserByUsername(username)
        if (userByUsername) {
            return res.status(400).json({
                error: '用戶名稱已經被取'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                error: '密碼和確認密碼不相同！'
            })
        }

        const hashedPassword = await hashingPassword(password);

        await createFinderUser(username, hashedPassword, name)

        return res.status(200).json({
            success: '成功註冊！'
        })

    } catch (err) {
        next(err)
    }
}

module.exports.registerOwner = async (req, res, next) => {
    try {
        const { username, password, confirmPassword, title } = req.body;

        if (!username || !password || !confirmPassword || !title) {
            return res.status(400).json({
                error: '用戶名稱或密碼不能留空！'
            })
        }

        if (regExpCheck(username)) {
            return res.status(400).json({
                error: '用戶名稱不能有特殊符號'
            })
        }

        const userByUsername = await obtainUserByUsername(username)
        if (userByUsername) {
            return res.status(400).json({
                error: '用戶名稱已經被取'
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                error: '密碼和確認密碼不相同！'
            })
        }

        const hashedPassword = await hashingPassword(password);
        const stripeAccount = await stripe.accounts.create({ type: 'standard' })
        await createOwnerUser(username, hashedPassword, title, stripeAccount.id)

        return res.status(200).json({
            success: '註冊成功！'
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getRoomsByUser = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) {
            return res.status(400).json({
                error: 'Unauthorised'
            })
        }
        const { id } = req.user;
        const room = await getAllRoomsByUser(id)
        return res.status(200).json({
            room: room
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getServicesByUser = async (req, res, next) => {
    try {
        if (req.params.id !== req.user.id) {
            return res.status(400).json({
                error: 'Unauthorised'
            })
        }

        const { id } = req.user
        const service = await getAllServicesByUser(id)
        return res.status(200).json({
            service: service
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await obtainUserById(id)
        return res.status(200).json({
            user: user
        })
    } catch (err) {
        next(err)
    }
}