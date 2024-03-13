const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'News'
    }
});

module.exports = mongoose.model('Comment', commentSchema);