const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.post('/schedule-message', async (req, res) => {
    try {
        const { message, day, time } = req.body;

        if (!message || !day || !time) {
            return res.status(400).send('Message, day, and time are required.');
        }

        // Calculate the delay until the scheduled time
        const now = new Date();
        const scheduledTime = new Date(`${day}T${time}`);
        const delay = scheduledTime - now;

        if (delay <= 0) {
            return res.status(400).send('Scheduled time must be in the future.');
        }

        // Schedule the message to be inserted at the specified time
        setTimeout(async () => {
            const newMessage = new Message({
                message,
                day: new Date(day),
                time,
                status: 'sent'
            });

            await newMessage.save();
            console.log(`Message scheduled at ${time} has been inserted.`);
        }, delay);

        res.status(201).send(`Message scheduled to be inserted at ${time}.`);
    } catch (error) {
        res.status(500).send('Error scheduling message: ' + error.message);
    }
});

module.exports = router;
