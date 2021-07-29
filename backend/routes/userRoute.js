require('dotenv').config
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Owner = require('../model/Owner')
const jwt = require('jsonwebtoken');
const hashingPassword = require('../utils/hashingPassword');
const verifyPassword = require('../utils/verifyPassword');
const regExpCheck = require('../utils/regExpCheck');
const { paypalAuth } = require('../utils/middleware');
const { isAuthorised } = require('../utils/middleware');
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');

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
                res.json({
                    userid: user._id,
                    username: user.username,
                    permission: user.permission
                })
            }
        });
    } catch (err) {
        next(err)
    }
})

router.get('/onboard', isAuthorised, paypalAuth, async (req, res, next) => {
    try {
        const tracker = uuidv4()
        const payload = {
            tracking_id: tracker,
            operations: [
                {
                    operation: 'API_INTEGRATION',
                    api_integration_preference: {
                        rest_api_integration: {
                            integration_method: 'PAYPAL',
                            integration_type: 'THIRD_PARTY',
                            third_party_details: {
                                features: [
                                    'PAYMENT',
                                    'REFUND',
                                    'PARTNER_FEE',
                                ]
                            }
                        }
                    }
                }
            ],
            products: [
                "EXPRESS_CHECKOUT"
            ],
            legal_consents: [
                {
                    type: "SHARE_DATA_CONSENT",
                    granted: true
                }
            ]
        }
        const response = await axios.post('https://api-m.sandbox.paypal.com/v2/customer/partner-referrals', JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.accessToken}`
            }
        })
        await Owner.findByIdAndUpdate(req.user.id, {
            tracking_id: tracker
        })
        res.json({
            self_url: response.data.links[0].href,
            action_url: response.data.links[1].href
        })
    } catch (err) {
        next(err)
    }
})

router.get('/onboard/status', isAuthorised, paypalAuth, async (req, res, next) => {
    try {
        const owner = await Owner.findById(req.user.id);
        const { tracking_id } = owner;
        if (!tracking_id) return res.json({ status: false })
        const response = await axios.get(`https://api-m.sandbox.paypal.com/v1/customer/partners/${process.env.PAYPAL_PARTNER_ID}/merchant-integrations?tracking_id=${tracking_id}`, {
            headers: {
                'Authorization': `Bearer ${req.accessToken}`
            }
        })
        const merchant_id = response.data.merchant_id;
        if (!owner.merchant_id) {
            owner.merchant_id = merchant_id;
            await owner.save();
        }
        const status = await axios.get(`https://api-m.sandbox.paypal.com/v1/customer/partners/${process.env.PAYPAL_PARTNER_ID}/merchant-integrations/${merchant_id}`, {
            headers: {
                'Authorization': `Bearer ${req.accessToken}`
            }
        })
        res.json({
            status: (status.data.payments_receivable && status.data.primary_email_confirmed ? true : false)
        })
    } catch (err) {
        next(err)
    }
})

router.post('/register', async (req, res, next) => {
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
            const user = new Owner({
                email: email,
                username: username,
                hash: hash,
                title: title
            })
            await user.save();
            jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) throw new Error(err);
                res.json({
                    token: token,
                    username: user.username,
                    permission: user.permission
                });
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
                token: token,
                username: user.username,
                userid: user._id,
                permission: user.permission || null
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