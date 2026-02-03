require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { generalLimiter } = require('./middlewares/rateLimiter');

// Routes import
const { authRouter } = require('./routes/auth');
const { postRouter } = require('./routes/post');
const { userRouter } = require('./routes/user'); // User follow/unfollow routes
const { mediaRouter } = require('./routes/media'); // R2 media upload routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply general rate limiting to all routes
app.use('/api/', generalLimiter);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter); // User follow/unfollow endpoints
app.use('/api/v1/media', mediaRouter); // R2 media upload endpoints

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

// Database connection and server start
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});