const express = require('express');
const userRouter = express.Router();
const { socialLimiter } = require('../middlewares/rateLimiter');
const { userAuth } = require('../middlewares/userAuth');

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require('../controllers/userController');

// Follow/unfollow routes (protected)
userRouter.post('/:userId/follow', socialLimiter, userAuth, followUser);
userRouter.delete('/:userId/follow', socialLimiter, userAuth, unfollowUser);

// Get followers/following lists (public)
userRouter.get('/:userId/followers', getFollowers);
userRouter.get('/:userId/following', getFollowing);

module.exports = {
    userRouter
};