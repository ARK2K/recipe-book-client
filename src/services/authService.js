import axiosInstance from '../utils/axiosInstance';

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/users/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axiosInstance.post('/api/users/register', {
      name,
      email,
      password
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/api/users/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/api/users/profile', profileData);
    return response.data;
  }
};

export default authService;