require('dotenv').config
const User = require('../model/User');
const Review = require('../model/Review');
const jwt = require('jsonwebtoken');

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
