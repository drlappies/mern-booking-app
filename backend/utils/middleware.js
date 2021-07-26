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

module.exports.isRoomOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.ownedRooms.includes(req.params.id) || !user.isRoomOwner) {
            res.status(401)
            throw new Error('權限不足');
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (req.user.id != review.author) {
            res.status(401)
            throw new Error('權限不足');
        }
        next()
    } catch (err) {
        next(err)
    }
}
