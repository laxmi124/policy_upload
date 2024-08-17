require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');
const aggregateRoutes = require('./routes/aggregate');
const monitorCPU = require('./monitor'); 
const scheduleMessage = require('./routes/scheduleMessage')

const app = express();
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', searchRoutes);
app.use('/api', aggregateRoutes);
app.use('/api', aggregateRoutes);
app.use('/api', scheduleMessage);



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
