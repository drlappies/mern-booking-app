const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashingPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = hashingPassword