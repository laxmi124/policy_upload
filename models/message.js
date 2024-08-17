const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    day: { type: Date, required: true },
    time: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
