import api from './axios';

export const usersAPI = {
  // Follow a user
  followUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },

  // Get followers of a user
  getFollowers: async (userId) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  // Get following of a user
  getFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },

  // Search users by name or handle
  searchUsers: async (query) => {
    // For now, we'll search users by getting all users and filtering
    // In a real app, you'd want a dedicated search endpoint
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data;
  },

  // Get suggested users to follow
  getSuggestedUsers: async () => {
    const response = await api.get('/users/suggested');
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};
