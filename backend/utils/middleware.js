require('dotenv').config
const jwt = require('jsonwebtoken');

module.exports.isAuthorised = (req, res, next) => {
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded;
    next();
}