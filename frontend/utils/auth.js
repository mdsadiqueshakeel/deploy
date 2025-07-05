import api from './api';

// Enhanced token storage with fallback to localStorage for Safari private mode
export const setToken = (token) => {
  try {
    sessionStorage.setItem('token', token);
    console.log('Token set in sessionStorage');
  } catch (error) {
    // Fallback to localStorage if sessionStorage fails
    console.warn('SessionStorage failed, using localStorage fallback:', error);
    try {
      localStorage.setItem('token', token);
      console.log('Token set in localStorage (fallback)');
    } catch (localStorageError) {
      console.error('All storage methods failed:', localStorageError);
    }
  }
};

export const getToken = () => {
  // Try sessionStorage first
  let token = null;
  try {
    token = sessionStorage.getItem('token');
  } catch (error) {
    console.warn('Error accessing sessionStorage:', error);
  }
  
  // If not found in sessionStorage, try localStorage
  if (!token) {
    try {
      token = localStorage.getItem('token');
      if (token) console.log('Token retrieved from localStorage fallback');
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }
  
  return token;
};

export const removeToken = () => {
  try {
    sessionStorage.removeItem('token');
  } catch (error) {
    console.warn('Error removing token from sessionStorage:', error);
  }
  
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.warn('Error removing token from localStorage:', error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/auth/check-auth');
    return response.data.authenticated ? response.data.user : null;
  } catch (error) {
    return null;
  }
};

// Enhanced logout function with cross-browser compatibility
export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
    // Clear any client-side state from both storage types
    clearAllTokens();
    
    // Force a page reload to clear any in-memory state
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Clear tokens even if API call fails
    clearAllTokens();
    
    // Force a page reload to clear any in-memory state
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
};

// Helper function to clear all tokens from all storage types
export const clearAllTokens = () => {
  // Clear from sessionStorage
  try {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
  } catch (error) {
    console.warn('Error clearing sessionStorage:', error);
  }
  
  // Clear from localStorage
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  } catch (error) {
    console.warn('Error clearing localStorage:', error);
  }
};

// Helper function to get admin token with fallback
export const getAdminToken = () => {
  // Try sessionStorage first
  let token = null;
  try {
    token = sessionStorage.getItem('adminToken');
  } catch (error) {
    console.warn('Error accessing sessionStorage for admin token:', error);
  }
  
  // If not found in sessionStorage, try localStorage
  if (!token) {
    try {
      token = localStorage.getItem('adminToken');
      if (token) console.log('Admin token retrieved from localStorage fallback');
    } catch (error) {
      console.warn('Error accessing localStorage for admin token:', error);
    }
  }
  
  return token;
};

// Helper function to set admin token with fallback
export const setAdminToken = (token) => {
  try {
    sessionStorage.setItem('adminToken', token);
    console.log('Admin token set in sessionStorage');
  } catch (error) {
    // Fallback to localStorage if sessionStorage fails
    console.warn('SessionStorage failed for admin token, using localStorage fallback:', error);
    try {
      localStorage.setItem('adminToken', token);
      console.log('Admin token set in localStorage (fallback)');
    } catch (localStorageError) {
      console.error('All storage methods failed for admin token:', localStorageError);
    }
  }
};
