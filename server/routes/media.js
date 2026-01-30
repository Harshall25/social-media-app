const express = require('express');
const mediaRouter = express.Router();
const { mediaLimiter } = require('../middlewares/rateLimiter');
const multer = require('multer');
const { userAuth } = require('../middlewares/userAuth');
const { uploadToR2, deleteFromR2 } = require('../config/r2');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'), false);
        }
    }
});

// Upload single media file to R2
mediaRouter.post('/upload', mediaLimiter, userAuth, upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate unique filename
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `media/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

        // Upload to R2
        const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);

        res.status(200).json({
            message: 'Media uploaded successfully',
            url: publicUrl,
            fileName: fileName
        });
    } catch (error) {
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

// Delete media from R2
mediaRouter.delete('/delete/:fileName', userAuth, async (req, res) => {
    try {
        const { fileName } = req.params;

        await deleteFromR2(fileName);

        res.status(200).json({
            message: 'Media deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Deletion failed',
            message: error.message
        });
    }
});

module.exports = {
    mediaRouter
};