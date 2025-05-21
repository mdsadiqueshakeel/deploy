// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Include HTTP-only cookies for JWT authentication
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;