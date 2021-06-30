const Review = require('../model/Review');
const Room = require('../model/Room');
const User = require('../model/User');

module.exports.createReview = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const room = await Room.findById(req.params.id);
        const { reviewBody, rating } = req.body;
        const newReview = new Review({
            author: user,
            room: room,
            reviewBody: reviewBody,
            rating: rating
        });
        room.reviews.push(newReview);
        await room.save();
        await newReview.save();
        res.redirect(`/room/${room._id}`);
    } catch (err) {
        next(err)
    }
}

module.exports.getOneReview = async (req, res, next) => {
    try {
        const foundReview = await Review.findById(req.params.reviewId);
        if (!foundReview) throw new Error('查無此留言，可能已被作者或管理員刪除')
        res.json({
            review: foundReview
        })
    } catch (err) {
        next(err)
    }
}

module.exports.deleteOneReview = async (req, res, next) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
        if (!deletedReview) throw new Error('查無此留言，可能已被作者或管理員刪除')
        res.json({
            deletedReview: deletedReview
        });
    } catch (err) {
        next(err)
    }
}