const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    keyPoints: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', noteSchema);
