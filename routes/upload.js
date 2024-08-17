const express = require('express');
const multer = require('multer');
const { Worker } = require('node:worker_threads');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File Info:', req.file);
    const worker = new Worker('./workers/uploadWorker.js', {
        workerData: {
            filePath: req.file.path,
            fileType: req.file.mimetype
        }
    });

    worker.on('message', (message) => {
        res.status(200).send(message);
    });

    worker.on('error', (error) => {
        res.status(500).send(error.message);
    });

    worker.on('exit', (code) => {
        if (code !== 0)
            res.status(500).send(`Worker stopped with exit code ${code}`);
    });
});

module.exports = router;
