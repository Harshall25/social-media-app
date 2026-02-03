import api from './axios';

export const postsAPI = {
  // Get all posts with optional filters
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Search posts by tags and content
  searchPosts: async (query, params = {}) => {
    const response = await api.get('/posts', { 
      params: { 
        search: query,
        ...params 
      } 
    });
    return response.data;
  },

  // Get trending hashtags
  getTrendingHashtags: async (limit = 10) => {
    const response = await api.get('/posts/trending/hashtags', { params: { limit } });
    return response.data;
  },

  // Get single post by ID
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts/create', postData);
    return response.data;
  },

  // Update a post
  updatePost: async (id, postData) => {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like a post
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Unlike a post
  unlikePost: async (id) => {
    const response = await api.delete(`/posts/${id}/like`);
    return response.data;
  },

  // Get comments for a post
  getComments: async (id) => {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (id, content) => {
    const response = await api.post(`/posts/${id}/comments`, { content });
    return response.data;
  },
};
