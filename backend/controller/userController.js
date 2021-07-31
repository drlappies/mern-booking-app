const User = require('../model/User');
const Owner = require('../model/Owner')
const jwt = require('jsonwebtoken');
const hashingPassword = require('../utils/hashingPassword');
const verifyPassword = require('../utils/verifyPassword');
const regExpCheck = require('../utils/regExpCheck');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.getUser = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).send('請先登入');
            } else {
                const user = await User.findById(decoded.id);
                res.json({
                    userid: user._id,
                    username: user.username,
                    permission: user.permission,
                    stripe_id: user.stripe_id || null
                })
            }
        });
    } catch (err) {
        next(err)
    }
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password, permission, title } = req.body;
        if (!email || !username || !password || !permission) {
            return res.status(400).send('用戶名稱或密碼不能留空！')
        }
        if (regExpCheck(username)) {
            return res.status(400).send('用戶名稱不能有特殊符號')
        }
        const user = await User.findOne({ username: username })
        if (user) {
            return res.status(400).send('用戶名稱已經被取')
        }
        const hash = await hashingPassword(password);
        if (permission === 'finder') {
            const user = new User({
                email: email,
                username: username,
                hash: hash,
            })
            await user.save();
            jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) throw new Error(err);
                res.json({
                    token: token,
                    username: user.username,
                });
            })
        } else if (permission === 'owner') {
            const stripeAccount = await stripe.accounts.create({
                type: 'standard',
                email: email,
            })
            const user = new Owner({
                email: email,
                username: username,
                hash: hash,
                title: title,
                stripe_id: stripeAccount.id
            })
            await user.save();

            jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) throw new Error(err);
                res.json({
                    token: token,
                    username: user.username,
                    permission: user.permission,
                });
            })
        }
    } catch (err) {
        next(err)
    }
}

module.exports.loginUser = async (req, res, next) => {
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
                token: token,
                username: user.username,
                userid: user._id,
                permission: user.permission || null
            });
        })
    } catch (err) {
        next(err)
    }
}