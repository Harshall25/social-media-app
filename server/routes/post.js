const express = require('express');
const postRouter = express.Router();
const { postLimiter, socialLimiter } = require('../middlewares/rateLimiter');
const { userAuth } = require('../middlewares/userAuth');

const {
    createPost,
    deletePost,
    renderPost,
    renderbyId,
    updatePost,
    addComment,
    getComments,
    likePost,
    unlikePost,
    getTrendingHashtags
} = require('../controllers/postController');

// Post routes
postRouter.post('/create', postLimiter, userAuth, createPost);
// Make userAuth optional by creating a middleware that doesn't fail if no token
const optionalAuth = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const { JWT_KEY } = require('../middlewares/userAuth');
            const decoded = jwt.verify(token, JWT_KEY);
            req.userId = decoded.id;
        } catch (err) {
            // Token invalid, but continue without auth
        }
    }
    next();
};

postRouter.get('/', optionalAuth, renderPost);
postRouter.get('/:id', renderbyId);
postRouter.patch('/:id', userAuth, updatePost);
postRouter.delete('/:id', userAuth, deletePost);

// Comment routes
postRouter.post('/:id/comments', userAuth, addComment);
postRouter.get('/:id/comments', getComments);

// Like routes
postRouter.post('/:id/like', socialLimiter, userAuth, likePost);
postRouter.delete('/:id/like', socialLimiter, userAuth, unlikePost);

// Trending hashtags
postRouter.get('/trending/hashtags', getTrendingHashtags);

module.exports = {
    postRouter
};