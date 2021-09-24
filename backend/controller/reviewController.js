const Review = require('../model/Review');
const Room = require('../model/Room');
const { getReviewsByRoom, insertReview } = require('../service/reviewService')

module.exports.fetchReviewsByRoom = async (req, res) => {
    try {
        const { roomid } = req.params;
        const reviews = await getReviewsByRoom(roomid)
        return res.status(200).json(reviews)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.createReview = async (req, res) => {
    try {
        const { roomid } = req.params;
        const { id } = req.user;
        const { body } = req.body;
        if (!body) {
            return res.status(400).json({
                error: '留言不能留空！'
            })
        }
        const review = await insertReview(id, roomid, body)
        return res.status(200).json({
            success: '成功留言！'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.getOneReview = async (req, res) => {
    try {
        const foundReview = await Review.findById(req.params.reviewId);
        if (!foundReview) throw new Error('查無此留言，可能已被作者或管理員刪除')
        res.json({
            review: foundReview
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.deleteOneReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
        if (!deletedReview) throw new Error('查無此留言，可能已被作者或管理員刪除')
        res.json({
            deletedReview: deletedReview
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}