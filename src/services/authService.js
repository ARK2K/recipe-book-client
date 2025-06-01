import axiosInstance from '../utils/axiosInstance';

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axiosInstance.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/api/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/api/auth/profile', profileData);
    return response.data;
  }
};

export default authService;