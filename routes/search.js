const express = require('express');
const Policy = require('../models/policy');
const User = require('../models/user');
const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const userName = req.query.name;
        const user = await User.findOne({ firstName: userName });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const policies = await Policy.find({ userId: user._id }).populate('userId');
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
