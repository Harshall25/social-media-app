require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes import
const { authRouter } = require('./routes/auth');
const { postRouter } = require('./routes/post');
const { mediaRouter } = require('./routes/media'); // Cloudinary media upload routes
const { userRouter } = require('./routes/user'); // User follow/unfollow routes


// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/media', mediaRouter); // Media upload endpoints
app.use('/api/v1/users', userRouter); // User follow/unfollow endpoints

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});