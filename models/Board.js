/* Dependency 라이브러리를 불러옵니다. */
const mongoose = require('mongoose');

/* Board 오브젝트를 정의합니다. */
const boardSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const Board = mongoose.model('board', boardSchema);
module.exports = Board;