// import axios from 'axios';
// const API = axios.create({
//   baseURL: 'http://localhost:5000/api', // Remove /auth from base URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Add request interceptor
// API.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor
// API.interceptors.response.use(
//   response => response,
//   error => {
//     const errorMessage = error.response?.data?.error ||
//       error.message ||
//       'Unknown error occurred';
//     return Promise.reject(errorMessage);
//   }
// );

// export default API;

import axios from 'axios';

// Use environment variable for API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Critical for sending cookies with cross-origin requests
});

// Add request interceptor to include admin token
API.interceptors.request.use(config => {
  // For debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('API Request:', {
      url: config.url,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;