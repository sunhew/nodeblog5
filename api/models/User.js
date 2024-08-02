const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    youName: {
        type: String,
        required: true
    },
    youEmail: {
        type: String,
        required: true,
        unique: true
    },
    youPass: {
        type: String,
        required: true
    }
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;
