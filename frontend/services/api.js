import axios from 'axios';
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Remove /auth from base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.error ||
      error.message ||
      'Unknown error occurred';
    return Promise.reject(errorMessage);
  }
);

export default {
  register: (data) => API.post('/auth/register', data), // Add /auth prefix here
  login: (data) => API.post('/auth/login', data), // Add /auth prefix here
};