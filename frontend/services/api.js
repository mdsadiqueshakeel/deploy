

// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include admin token
// API.interceptors.request.use(config => {
//   const adminToken = sessionStorage.getItem('adminToken');
//   if (adminToken) {
//     config.headers.Authorization = `Bearer ${adminToken}`;
//   }
//   return config;
// });



// export default API;
import axios from 'axios';

const api = axios.create({  // Changed from API to api
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Combined request interceptor
api.interceptors.request.use(
  (config) => {
    // First try admin token
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }
    
    // Fall back to regular token
    const token = sessionStorage.getItem('token');
    console.log("Interceptor attaching token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;  // Consistent lowercase export