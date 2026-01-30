const { postModel, commentModel, likeModel } = require('../schema');
const { z } = require('zod');

// Zod validation schemas
const mediaSchema = z.object({
    type: z.enum(['image', 'video'], "Type must be 'image' or 'video'"),
    url: z.string().url("Invalid URL format"),
    publicId: z.string().min(1, "Public ID is required")
});

const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).optional(),
    media: z.array(mediaSchema).optional() // Array of media objects for Cloudinary uploads
});

const updatePostSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    media: z.array(mediaSchema).optional() // Updated media array
});

const commentSchema = z.object({
    content: z.string().min(1, "Comment content is required")
});

// Create post (protected)
const createPost = async (req, res) => {
    try {
        // Validate input
        const validatedData = createPostSchema.parse(req.body);
        const { title, content, tags, media } = validatedData;

        const post = await postModel.create({
            title: title,
            content: content,
            tags: tags || [],
            media: media || [], // Array of media objects from Cloudinary
            author: req.userId
        });

        res.status(201).json({
            message: "Post created successfully",
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

// Get all posts (public)
const renderPost = async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
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
        const { title, content, tags, media } = validatedData;

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
        if (media !== undefined) post.media = media; // Update media array
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

module.exports = {
    createPost,
    renderPost,
    renderbyId,
    updatePost,
    deletePost,
    addComment,
    getComments,
    likePost,
    unlikePost
};



