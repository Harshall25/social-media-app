const express = require('express');
const Router = express.Router();
const userRouter = Router;
const { userAuth } = require('../middlewares/userAuth');

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require('../controllers/userController');

// Follow/unfollow routes (protected)
userRouter.post('/:userId/follow', userAuth, followUser);
userRouter.delete('/:userId/follow', userAuth, unfollowUser);

// Get followers/following lists (public)
userRouter.get('/:userId/followers', getFollowers);
userRouter.get('/:userId/following', getFollowing);

module.exports = {
    userRouter
};