import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    const bearerToken = `Bearer ${user.token}`;
    config.headers.Authorization = bearerToken;
    console.log('🔐 Sending Authorization header:', bearerToken);
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;