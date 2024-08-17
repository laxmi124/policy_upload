const express = require('express');
const Policy = require('../models/policy');
const router = express.Router();

router.get('/aggregate', async (req, res) => {
    try {
        const aggregateData = await Policy.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalPolicies: { $sum: 1 },
                    policies: { $push: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);
        res.status(200).json(aggregateData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
