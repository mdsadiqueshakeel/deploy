import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // This ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Remove the request interceptor that adds the token from localStorage
// since we're now using HTTP-only cookies for authentication

// Add response interceptor for error handling
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;