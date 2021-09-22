const Review = require('../model/Review');

module.exports.getReviewsByRoom = async (id) => {
    const reviews = await Review.find({ room: id })
        .populate({
            path: 'author',
            model: 'User',
            select: { createdAt: 0, hash: 0, permission: 0, updatedAt: 0, __v: 0, username: 0, _id: 0 }
        })
    return reviews
}

module.exports.insertReview = async (userid, roomid, body) => {
    const review = new Review({
        author: userid,
        room: roomid,
        body: body,
    })

    await review.save()

    return review
}