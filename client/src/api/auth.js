import api from './axios';

export const authAPI = {
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  signin: async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  },
};
