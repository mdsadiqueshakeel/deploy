import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // change as needed
});

export const loginUser = (credentials) => API.post('/login', credentials);
export const signupUser = (data) => API.post('/signup', data);

export default API;
