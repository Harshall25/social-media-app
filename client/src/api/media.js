import api from './axios';

export const mediaAPI = {
  // Upload media file
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
