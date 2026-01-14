const express = require('express');
const Router = express.Router();
const postRouter = Router();
const {userAuth} = require('../middlewares/userAuth');

const {createPost, deletePost,renderPost,renderbyId,updatePost} = require('../controllers/postController');


postRouter.post('/create-post',userAuth, createPost);
postRouter.get('/get-post',renderPost);
postRouter.get('/get-post/:id',renderbyId);
postRouter.patch('/update-post/:id',userAuth,updatePost)
postRouter.delete('/delete-post/:id',userAuth, deletePost);

module.exports ={
    postRouter
}