import axios from "axios";

const API_URL = 'http://localhost:3000';

// Axios instance with default config
const api = axios.create({
    baseURL: API_URL,
});

// Add JWT token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API endpoints
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    signin: (data) => api.post('/auth/signin', data),
};

export const postsAPI = {
    getAll: () => api.get('/posts'),
    getById: (id) => api.get(`/posts/${id}`),
    create: (data) => api.post('/posts/create', data),
    update: (id, data) => api.patch(`/posts/${id}`, data),
    delete: (id) => api.delete(`/posts/${id}`),
    like: (id) => api.post(`/posts/${id}/like`),
    unlike: (id) => api.delete(`/posts/${id}/like`),
    addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
    getComments: (id) => api.get(`/posts/${id}/comments`),
};

export const userAPI = {
    getProfile: (id) => api.get(`/users/${id}`),
    follow: (id) => api.post(`/users/${id}/follow`),
    unfollow: (id) => api.delete(`/users/${id}/follow`),
    getFollowers: (id) => api.get(`/users/${id}/followers`),
    getFollowing: (id) => api.get(`/users/${id}/following`),
};

export const mediaAPI = {
    upload: (formData) => api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;

