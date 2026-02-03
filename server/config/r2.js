const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});


// UPLOAD FILE TO R2
const uploadToR2 = async (fileBuffer, fileName, contentType) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType
        });

        await s3Client.send(command);

        // return the public url through our server
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        const publicUrl = `${baseUrl}/api/v1/media/file/${fileName}`;
        
        return publicUrl;
    } catch (error) {
        throw new Error(`R2 upload failed: ${error.message}`);
    }
};


// delete file from r2
const deleteFromR2 = async (fileName) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
        });
        await s3Client.send(command);
        return true;
    } catch (error) {
        throw new Error(`R2 deletion failed: ${error.message}`);
    }
};

module.exports = {
    s3Client,
    uploadToR2,
    deleteFromR2
};




