import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:5000/api
  withCredentials: true,
});

// Add request interceptor for logging
instance.interceptors.request.use(request => {
  console.log('Starting Request', request.url);
  return request;
});

// Add response interceptor for error handling
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;