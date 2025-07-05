// utils/api.js - This will be your single, comprehensive Axios instance for all API calls.

import axios from 'axios';

// Determine the API base URL.
// It tries to use NEXT_PUBLIC_API_URL from environment variables first.
// If not set (e.g., in development without a .env file), it defaults to http://localhost:5000.
// This is critical for Docker Compose networking:
// - From your browser: http://localhost:5000 (because Docker maps container port 5000 to host port 5000)
// - From frontend container to API Gateway container: http://api-gateway:5000 (using Docker's internal DNS resolution)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a function to detect Safari/iOS browsers
const isSafariOrIOS = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  return isSafari || isIOS;
};

// Create an Axios instance with enhanced cross-browser compatibility
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps with CORS in Safari
    'Accept': 'application/json', // Explicitly set Accept header for better compatibility
  },
  withCredentials: true, // Necessary for sending cookies/session tokens
  xsrfCookieName: 'XSRF-TOKEN', // Default CSRF cookie name
  xsrfHeaderName: 'X-XSRF-TOKEN', // Default CSRF header name
});

// --- Request Interceptor: Add Authorization header with enhanced browser compatibility ---
// This interceptor will run before every API request.
api.interceptors.request.use(
  (config) => {
    // Get the user's general authentication token
    const userToken = sessionStorage.getItem('token'); 

    // Get the admin-specific authentication token
    const adminToken = sessionStorage.getItem('adminToken');

    // Try localStorage as fallback if sessionStorage fails (for Safari private mode)
    let finalUserToken = userToken;
    let finalAdminToken = adminToken;
    
    if (!finalUserToken && typeof localStorage !== 'undefined') {
      finalUserToken = localStorage.getItem('token');
    }
    
    if (!finalAdminToken && typeof localStorage !== 'undefined') {
      finalAdminToken = localStorage.getItem('adminToken');
    }

    // Logic to decide which token to send:
    // If the request URL includes '/admin/' AND an adminToken exists, use the adminToken.
    // Otherwise, if a general userToken exists, use that.
    if (finalAdminToken && config.url && config.url.includes('/admin/')) {
      config.headers.Authorization = `Bearer ${finalAdminToken}`;
      console.log('Using admin token for request');
    } else if (finalUserToken) {
      // For all other authenticated endpoints, use the user token.
      config.headers.Authorization = `Bearer ${finalUserToken}`;
      console.log('Using user token for request');
    }
    
    // Add comprehensive browser compatibility headers
    if (isSafariOrIOS()) {
      // Safari/iOS specific headers for better CORS compatibility
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
      // Add additional headers for Safari
      config.headers['Accept'] = 'application/json, text/plain, */*';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      console.log('Added Safari/iOS compatibility headers');
    }

    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor: Handle Responses and Errors with enhanced token handling ---
api.interceptors.response.use(
  (response) => {
    // Check if we received a token in the response and store it
    if (response.data && response.data.token) {
      try {
        // Try to store in sessionStorage first
        sessionStorage.setItem('token', response.data.token);
        console.log('Token stored in sessionStorage');
        
        // For admin login responses
        if (response.config.url && response.config.url.includes('/admin/login')) {
          sessionStorage.setItem('adminToken', response.data.token);
          console.log('Admin token stored in sessionStorage');
        }
      } catch (storageError) {
        // Fallback to localStorage if sessionStorage fails (Safari private mode)
        console.warn('SessionStorage failed, using localStorage as fallback:', storageError);
        try {
          localStorage.setItem('token', response.data.token);
          console.log('Token stored in localStorage (fallback)');
          
          // For admin login responses
          if (response.config.url && response.config.url.includes('/admin/login')) {
            localStorage.setItem('adminToken', response.data.token);
            console.log('Admin token stored in localStorage (fallback)');
          }
        } catch (localStorageError) {
          console.error('All storage methods failed:', localStorageError);
        }
      }
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // If the error response exists and its status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request detected. Clearing tokens and redirecting to login...');
      // Clear all potential authentication tokens from both storage types
      try {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('adminToken');
      } catch (e) { console.warn('Error clearing sessionStorage:', e); }
      
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
      } catch (e) { console.warn('Error clearing localStorage:', e); }
      
      // Determine the appropriate redirect based on the URL
      if (typeof window !== 'undefined') { // Ensure this runs only in the browser
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        window.location.href = isAdminRoute ? '/admin/login' : '/auth/login';
      }
    }
    return Promise.reject(error); // Always reject the promise so calling code can catch it
  }
);

export default api;
