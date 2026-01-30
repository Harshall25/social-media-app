const express = require('express');
const Router = express.Router();
const postRouter = Router;
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
postRouter.post('/create', userAuth, createPost);
postRouter.get('/', renderPost);
postRouter.get('/:id', renderbyId);
postRouter.patch('/:id', userAuth, updatePost);
postRouter.delete('/:id', userAuth, deletePost);

// Comment routes
postRouter.post('/:id/comments', userAuth, addComment);
postRouter.get('/:id/comments', getComments);

// Like routes
postRouter.post('/:id/like', userAuth, likePost);
postRouter.delete('/:id/like', userAuth, unlikePost);

module.exports = {
    postRouter
};