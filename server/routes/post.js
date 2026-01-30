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
    unlikePost
} = require('../controllers/postController');

// Post routes
postRouter.post('/create', postLimiter, userAuth, createPost);
postRouter.get('/', renderPost);
postRouter.get('/:id', renderbyId);
postRouter.patch('/:id', userAuth, updatePost);
postRouter.delete('/:id', userAuth, deletePost);

// Comment routes
postRouter.post('/:id/comments', userAuth, addComment);
postRouter.get('/:id/comments', getComments);

// Like routes
postRouter.post('/:id/like', socialLimiter, userAuth, likePost);
postRouter.delete('/:id/like', socialLimiter, userAuth, unlikePost);

module.exports = {
    postRouter
};