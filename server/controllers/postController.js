const { postModel, commentModel, likeModel } = require('../schema');
const { z } = require('zod');

// Zod validation schemas
const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().optional()
});

const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url("Invalid URL format").optional()
});

const commentSchema = z.object({
    content: z.string().min(1, "Comment content is required")
});

// Create post (protected)
const createPost = async (req, res) => {
    try {
        // Validate input
        const validatedData = createPostSchema.parse(req.body);
        const { title, content, tags, imageUrl } = validatedData;

        // Example: After uploading to R2, use the returned URL
        const post = await postModel.create({
            title: title,
            content: content,
            tags: tags || [],
            imageUrl: imageUrl, // URL from request body
            author: req.userId
        });

        // Populate the author field for the response
        const populatedPost = await postModel.findById(post._id).populate('author', 'name email');

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Get all posts (public) with filtering and pagination
const renderPost = async (req, res) => {
    try {
        // Extract query parameters for filtering
        const { 
            author, 
            tags, 
            search, 
            limit = 20, 
            skip = 0, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            feedType
        } = req.query;

        // Build filter object
        const filter = {};
        
        // Filter by author
        if (author) {
            filter.author = author;
        }
        
        // Filter by tags (case-insensitive)
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            filter.tags = { $in: tagArray.map(tag => new RegExp(tag.trim(), 'i')) };
        }
        
        // Search in title and content (case-insensitive)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter for following feed (requires authentication)
        if (feedType === 'following') {
            if (!req.userId) {
                return res.status(401).json({ error: 'Authentication required for following feed' });
            }
            
            // Get current user's following list
            const { userModel } = require('../schema');
            const currentUser = await userModel.findById(req.userId).select('following');
            if (!currentUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            // Filter posts to only show from followed users OR the current user
            filter.author = { $in: [...currentUser.following, req.userId] };
        }

        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with filtering, sorting, and pagination
        const posts = await postModel.find(filter)
            .populate('author', 'name email')
            .sort(sortObj)
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        // Get total count for pagination
        const totalPosts = await postModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: posts.length,
            total: totalPosts,
            hasMore: parseInt(skip) + parseInt(limit) < totalPosts,
            pagination: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                page: Math.floor(parseInt(skip) / parseInt(limit)) + 1
            },
            posts: posts
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Get post by id (public)
const renderbyId = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postModel.findById(postId)
            .populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            post: post
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Update post (protected - only author can update)
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Validate input
        const validatedData = updatePostSchema.parse(req.body);
        const { title, content, tags, imageUrl } = validatedData;

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        // Check ownership - only author can update
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                error: 'Access denied. Only the post author can update this post'
            });
        }

        // Update fields
        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;
        if (tags !== undefined) post.tags = tags;
        if (imageUrl !== undefined) post.imageUrl = imageUrl;
        post.updatedAt = Date.now();

        await post.save();

        res.status(200).json({
            message: 'Post updated successfully',
            post: post
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Delete post (protected - only author can delete)
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Find the post
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        // Check ownership - only author can delete
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                error: 'Access denied. Only the post author can delete this post'
            });
        }

        await postModel.findByIdAndDelete(postId);

        // Also delete associated comments and likes
        await commentModel.deleteMany({ post: postId });
        await likeModel.deleteMany({ post: postId });

        res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Add comment (protected)
const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Validate input
        const validatedData = commentSchema.parse(req.body);
        const { content } = validatedData;

        // Check if post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        const comment = await commentModel.create({
            content: content,
            post: postId,
            user: userId
        });

        const populatedComment = await commentModel.findById(comment._id)
            .populate('user', 'name email');

        res.status(201).json({
            message: 'Comment added successfully',
            comment: populatedComment
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Get comments for a post (public)
const getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        // Check if post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        const comments = await commentModel.find({ post: postId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            comments: comments
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Like a post (protected)
const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Check if post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        // Check if already liked
        const existingLike = await likeModel.findOne({ post: postId, user: userId });
        if (existingLike) {
            return res.status(400).json({
                error: 'You have already liked this post'
            });
        }

        // Create like
        await likeModel.create({
            post: postId,
            user: userId
        });

        // Update likes count
        const likesCount = await likeModel.countDocuments({ post: postId });
        post.likesCount = likesCount;
        await post.save();

        res.status(200).json({
            message: 'Post liked successfully',
            likesCount: likesCount
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Unlike a post (protected)
const unlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // Check if post exists
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        // Check if like exists
        const existingLike = await likeModel.findOne({ post: postId, user: userId });
        if (!existingLike) {
            return res.status(400).json({
                error: 'You have not liked this post'
            });
        }

        // Remove like
        await likeModel.deleteOne({ post: postId, user: userId });

        // Update likes count
        const likesCount = await likeModel.countDocuments({ post: postId });
        post.likesCount = likesCount;
        await post.save();

        res.status(200).json({
            message: 'Post unliked successfully',
            likesCount: likesCount
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Get trending hashtags (public)
const getTrendingHashtags = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Aggregate hashtags from all posts
        const trendingHashtags = await postModel.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limit
            },
            {
                $project: {
                    hashtag: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            trending: trendingHashtags
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    renderPost,
    renderbyId,
    updatePost,
    deletePost,
    addComment,
    getComments,
    likePost,
    unlikePost,
    getTrendingHashtags
};



