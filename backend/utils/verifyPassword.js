const bcrypt = require('bcrypt');

const verifyPassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}

module.exports = verifyPassword