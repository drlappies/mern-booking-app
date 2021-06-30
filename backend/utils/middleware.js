const User = require('../model/User');
const Review = require('../model/Review');

module.exports.isLoggedIn = (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401)
            throw new Error('請先登入')
        }
    } catch (err) {
        next(err)
    }
    next()
}

module.exports.isRoomOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.ownedRooms.includes(req.params.id) || !user.isRoomOwner) {
            res.status(401)
            throw new Error('權限不足');
        }
    } catch (err) {
        next(err)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (req.user.id != review.author) {
            res.status(401)
            throw new Error('權限不足');
        }
    } catch (err) {
        next(err)
    }
    next()
}