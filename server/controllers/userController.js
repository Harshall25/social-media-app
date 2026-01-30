const { userModel } = require('../schema');

// Follow a user
const followUser = async (req, res) => {
    try {
        const { userId } = req.params; // User to follow
        const currentUserId = req.userId; // Current logged-in user

        //if following yourself
        if (userId === currentUserId) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        // Check if user to follow exists
        const userToFollow = await userModel.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already following
        const currentUser = await userModel.findById(currentUserId);
        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        // Add to following list of current user
        currentUser.following.push(userId);
        await currentUser.save();

        // Add to followers list of target user
        userToFollow.followers.push(currentUserId);
        await userToFollow.save();

        res.status(200).json({
            message: 'Successfully followed user',
            following: currentUser.following.length,
            followers: userToFollow.followers.length
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params; // User to unfollow
        const currentUserId = req.userId; // Current logged-in user

        if (userId === currentUserId) {
            return res.status(400).json({ error: 'You cannot unfollow yourself' });
        }

        // Check if user to unfollow exists
        const userToUnfollow = await userModel.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if currently following
        const currentUser = await userModel.findById(currentUserId);
        if (!currentUser.following.includes(userId)) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        // Remove from following list of current user
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        await currentUser.save();

        // Remove from followers list of target user
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);
        await userToUnfollow.save();

        res.status(200).json({
            message: 'Successfully unfollowed user',
            following: currentUser.following.length,
            followers: userToUnfollow.followers.length
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get followers of a user
const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId)
            .populate('followers', 'name email')
            .select('followers');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            count: user.followers.length,
            followers: user.followers
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Get users that a user is following
const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId)
            .populate('following', 'name email')
            .select('following');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            count: user.following.length,
            following: user.following
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};