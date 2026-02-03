const express = require('express');
const userRouter = express.Router();
const { socialLimiter } = require('../middlewares/rateLimiter');
const { userAuth } = require('../middlewares/userAuth');

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    searchUsers,
    getSuggestedUsers,
    getCurrentUser
} = require('../controllers/userController');

// Follow/unfollow routes (protected)
userRouter.post('/:userId/follow', socialLimiter, userAuth, followUser);
userRouter.delete('/:userId/follow', socialLimiter, userAuth, unfollowUser);

// Get followers/following lists (public)
userRouter.get('/:userId/followers', getFollowers);
userRouter.get('/:userId/following', getFollowing);

// Search users (public)
userRouter.get('/search', searchUsers);

// Get suggested users to follow (protected)
userRouter.get('/suggested', socialLimiter, userAuth, getSuggestedUsers);

// Get current user profile (protected)
userRouter.get('/me', socialLimiter, userAuth, getCurrentUser);

module.exports = {
    userRouter
};