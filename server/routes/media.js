const express = require('express');
const Router = express.Router();
const mediaRouter = Router;
const multer = require('multer');
const { userAuth } = require('../middlewares/userAuth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Configure multer for memory storage (required for Cloudinary)
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

// Upload single media file to Cloudinary
mediaRouter.post('/upload', userAuth, upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const mediaData = await uploadToCloudinary(req.file.buffer, 'social-media');

        res.status(200).json({
            message: 'Media uploaded successfully',
            media: mediaData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

// Upload multiple media files
mediaRouter.post('/upload-multiple', userAuth, upload.array('media', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Upload all files to Cloudinary
        const uploadPromises = req.files.map(file =>
            uploadToCloudinary(file.buffer, 'social-media')
        );

        const mediaResults = await Promise.all(uploadPromises);

        res.status(200).json({
            message: 'Media uploaded successfully',
            media: mediaResults
        });
    } catch (error) {
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

// Delete media from Cloudinary
mediaRouter.delete('/delete/:publicId', userAuth, async (req, res) => {
    try {
        const { publicId } = req.params;
        const { resourceType } = req.query; // 'image' or 'video'

        await deleteFromCloudinary(publicId, resourceType || 'image');

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