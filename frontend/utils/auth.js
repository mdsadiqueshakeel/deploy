import api from './api';

// export const setToken = (token) => {
//   sessionStorage.setItem('token', token);
// };

// export const getToken = () => {
//   return sessionStorage.getItem('token');
// };

// export const removeToken = () => {
//   sessionStorage.removeItem('token');
// };

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check-auth');
    return response.data.authenticated ? response.data.user : null;
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
    // Clear any client-side state
    sessionStorage.removeItem('token'); // Remove admin token from sessionStorage
  } catch (error) {
    // Handle error if needed
    sessionStorage.removeItem('token'); // Remove admin token even if API call fails
  }
};
