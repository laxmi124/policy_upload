const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: 'Unknown' },
    dob: { type: Date, default: Date.now },
    address: { type: String, default: 'Not Provided' },
    phone: { type: String, default: '000-000-0000' },
    state: { type: String, default: 'Unknown State' },
    zip: { type: String, default: '00000' },
    email: { type: String, default: 'example@example.com' },
    gender: { type: String, default: 'female' },
    city: { type: String, default: 'Unknown City' }
});

module.exports = mongoose.model('User', userSchema);
