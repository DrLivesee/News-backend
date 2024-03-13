const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    author: {
        required: true,
        type: String
    },
    published: {
        required: true,
        type: String
    },
    image: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    }
})

newsSchema.pre('save', function(next) {
    const requiredFields = ['author', 'published', 'image', 'title', 'description', 'content'];
    for (const field of requiredFields) {
        if (!this[field]) {
            return next(new Error(`${field} is required`));
        }
    }
    next();
});


module.exports = mongoose.model('news', newsSchema)