const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, '請輸入一個用戶名稱']
    },
    hash: {
        type: String,
        required: [true, 'Hash not found!']
    },
    contactNumber: {
        type: String,
        required: [true, '請提供一個香港地區電話號碼'],
        minLength: 8,
        maxLength: 8
    },
    fullName: {
        firstName: {
            type: String,
            required: [true, '請提供你的姓名']
        },
        lastName: {
            type: String,
            required: [true, '請提供你的姓名']
        }
    },
    isRoomOwner: {
        type: Boolean,
        default: false,
        required: [true, '你想點？']
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: [true, '想要當神嗎？']
    },
    ownedRooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
}, { timeStamps: true })

module.exports = mongoose.model('User', userSchema);