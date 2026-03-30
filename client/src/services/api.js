import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
console.log('API Base URL:', baseURL); // Helps us debug on the live site

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dealmind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dealmind_token');
      localStorage.removeItem('dealmind_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
