const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    boardTitle: {
        type: String,
        required: true
    },
    boardContents: { // 필드 이름 수정
        type: String,
        required: true
    },
    boardAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    boardViews: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const BoardModel = mongoose.model('Board', BoardSchema);

module.exports = BoardModel;
