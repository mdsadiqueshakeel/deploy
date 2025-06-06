// utils/api.js - This will be your single, comprehensive Axios instance for all API calls.

import axios from 'axios';

// Determine the API base URL.
// It tries to use NEXT_PUBLIC_API_URL from environment variables first.
// If not set (e.g., in development without a .env file), it defaults to http://localhost:5000.
// This is critical for Docker Compose networking:
// - From your browser: http://localhost:5000 (because Docker maps container port 5000 to host port 5000)
// - From frontend container to API Gateway container: http://api-gateway:5000 (using Docker's internal DNS resolution)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mlm-api-gateway-production.up.railway.app';


// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Necessary for sending cookies/session tokens if your backend uses them
});

// --- Request Interceptor: Add Authorization header ---
// This interceptor will run before every API request.
api.interceptors.request.use(
  (config) => {
    // Get the user's general authentication token
    // This is the token typically received after a standard user login.
    const userToken = localStorage.getItem('token'); 

    // Get the admin-specific authentication token
    // This token might be used for routes exclusively for administrators.
    const adminToken = localStorage.getItem('adminToken');

    // Logic to decide which token to send:
    // If the request URL includes '/admin/' AND an adminToken exists, use the adminToken.
    // Otherwise, if a general userToken exists, use that.
    // Adjust the `config.url.includes('/admin/')` condition based on your backend's actual URL structure for admin endpoints.
    if (adminToken && config.url && config.url.includes('/admin/')) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      // For all other authenticated endpoints (including user profile fetching), use the user token.
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    // If no token is found (e.g., for public routes like login/register, or if user is logged out),
    // the Authorization header will simply not be set, which is appropriate.

    console.log('Starting Request:', config.method?.toUpperCase(), config.url, 'Headers:', config.headers); // Log for debugging
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor: Handle Responses and Errors (e.g., 401 Unauthorized) ---
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url); // Log for debugging
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // If the error response exists and its status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request detected. Clearing tokens and redirecting to login...');
      // Clear all potential authentication tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken'); 
      
      // Redirect the user to the login page.
      // This is important for single-page applications to enforce re-authentication.
      if (typeof window !== 'undefined') { // Ensure this runs only in the browser
        window.location.href = '/auth/login'; // Forces a full page reload and redirect
      }
    }
    return Promise.reject(error); // Always reject the promise so calling code can catch it
  }
);

export default api;
