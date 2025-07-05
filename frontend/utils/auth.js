import api from './api';

export const setToken = (token) => {
  sessionStorage.setItem('token', token);
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const removeToken = () => {
  sessionStorage.removeItem('token');
};

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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken'); // Also remove admin token if it exists
    
    // Force a page reload to clear any in-memory state
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Clear tokens even if API call fails
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
    
    // Force a page reload to clear any in-memory state
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
};
