const cloudinary = require('cloudinary').v2;

// Cloudinary configuration - load from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Utility function to upload media to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = 'social-media', resourceType = 'auto') => {
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: resourceType, // 'auto' detects image/video
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' } // Resize for optimization
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(fileBuffer);
        });

        return {
            type: result.resource_type === 'image' ? 'image' : 'video',
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

// Utility function to delete media from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
};