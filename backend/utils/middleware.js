require('dotenv').config
const User = require('../model/User');
const Review = require('../model/Review');
const jwt = require('jsonwebtoken');
const axios = require('axios');


module.exports.isAuthorised = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).send('請先登入！')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded;
        next();
    } catch (err) {
        next(err)
    }
}


module.exports.paypalAuth = async (req, res, next) => {
    try {
        const response = await axios({
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Accept-Language': 'en_US',
                'content-type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET,
            },
            params: {
                grant_type: 'client_credentials',
            },
        });
        req.accessToken = response.data.access_token;
        next()
    } catch (err) {
        next(err)
    }
}