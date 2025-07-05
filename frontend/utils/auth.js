import api from './api';
import { getBrowserInfo } from './browserDetect';

// Enhanced token storage with fallback to localStorage for Safari private mode
export const setToken = (token) => {
  let tokenSetSuccessfully = false;
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment, cannot set token');
    return;
  }
  
  const browserInfo = getBrowserInfo();
  
  console.log(`Setting token on ${browserInfo.type}`);
  
  if (browserInfo.isPrivateMode) {
    console.log('Private browsing mode detected');
  }
  
  try {
    // First try to write a test value to check if sessionStorage is actually writable
    sessionStorage.setItem('test-write', '1');
    sessionStorage.removeItem('test-write');
    
    // If we get here, sessionStorage is working
    sessionStorage.setItem('token', token);
    console.log('Token set in sessionStorage');
    tokenSetSuccessfully = true;
  } catch (error) {
    // Fallback to localStorage if sessionStorage fails
    console.warn('SessionStorage failed, using localStorage fallback:', error);
    try {
      // First try to write a test value to check if localStorage is actually writable
      localStorage.setItem('test-write', '1');
      localStorage.removeItem('test-write');
      
      // If we get here, localStorage is working
      localStorage.setItem('token', token);
      console.log('Token set in localStorage (fallback)');
      tokenSetSuccessfully = true;
    } catch (localStorageError) {
      console.error('All storage methods failed:', localStorageError);
      
      // Log detailed error for debugging
      if (browserInfo.isSafari || browserInfo.isIOS) {
        console.error(`Storage failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'}: `, localStorageError);
      }
    }
  }
  return tokenSetSuccessfully;
};

export const getToken = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment, cannot get token');
    return null;
  }
  
  const browserInfo = getBrowserInfo();
  
  console.log(`Getting token on ${browserInfo.type}`);
  
  if (browserInfo.isPrivateMode) {
    console.log('Private browsing mode detected, token retrieval may be affected');
  }
  
  // Try sessionStorage first
  let token = null;
  try {
    token = sessionStorage.getItem('token');
    if (token) {
      console.log('Token retrieved from sessionStorage');
      return token;
    }
  } catch (error) {
    console.warn('Error accessing sessionStorage:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`SessionStorage access failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'}: `, error);
    }
  }
  
  // If not found in sessionStorage, try localStorage
  try {
    token = localStorage.getItem('token');
    if (token) {
      console.log('Token retrieved from localStorage fallback');
      return token;
    }
  } catch (error) {
    console.warn('Error accessing localStorage:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`LocalStorage access failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'}: `, error);
    }
  }
  
  // If we get here, no token was found in either storage
  if (browserInfo.isSafari || browserInfo.isIOS) {
    console.warn(`No token found in any storage on ${browserInfo.isIOS ? 'iOS' : 'Safari'} device`);
  }
  
  return null;
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
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment, cannot clear tokens');
    return;
  }
  
  const browserInfo = getBrowserInfo();
  
  console.log(`Clearing all tokens on ${browserInfo.type}`);
  
  if (browserInfo.isPrivateMode) {
    console.log('Private browsing mode detected, token clearing may be affected');
  }
  
  // Clear from sessionStorage
  try {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
    console.log('Tokens cleared from sessionStorage');
  } catch (error) {
    console.warn('Error clearing sessionStorage:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`SessionStorage clear failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'}: `, error);
    }
  }
  
  // Clear from localStorage
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    console.log('Tokens cleared from localStorage');
  } catch (error) {
    console.warn('Error clearing localStorage:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`LocalStorage clear failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'}: `, error);
    }
  }
  
  // Verify tokens are cleared
  let sessionTokenRemains = false;
  let localTokenRemains = false;
  
  try {
    sessionTokenRemains = sessionStorage.getItem('token') || sessionStorage.getItem('adminToken');
  } catch (e) {}
  
  try {
    localTokenRemains = localStorage.getItem('token') || localStorage.getItem('adminToken');
  } catch (e) {}
  
  if (sessionTokenRemains || localTokenRemains) {
    console.warn('Failed to clear all tokens from storage');
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`Token clearing verification failed on ${browserInfo.isIOS ? 'iOS' : 'Safari'} device`);
    }
  } else {
    console.log('All tokens successfully cleared from all storage types');
  }
};

// Helper function to get admin token with fallback
export const getAdminToken = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment, cannot get admin token');
    return null;
  }
  
  const browserInfo = getBrowserInfo();
  
  console.log(`Getting admin token on ${browserInfo.type}`);
  
  if (browserInfo.isPrivateMode) {
    console.log('Private browsing mode detected, token retrieval may be affected');
  }
  
  // Try sessionStorage first
  let token = null;
  try {
    token = sessionStorage.getItem('adminToken');
    if (token) {
      console.log('Admin token retrieved from sessionStorage');
      return token;
    }
  } catch (error) {
    console.warn('Error accessing sessionStorage for admin token:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`SessionStorage access failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'} for admin token: `, error);
    }
  }
  
  // If not found in sessionStorage, try localStorage
  try {
    token = localStorage.getItem('adminToken');
    if (token) {
      console.log('Admin token retrieved from localStorage fallback');
      return token;
    }
  } catch (error) {
    console.warn('Error accessing localStorage for admin token:', error);
    
    // Log detailed error for debugging
    if (browserInfo.isSafari || browserInfo.isIOS) {
      console.warn(`LocalStorage access failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'} for admin token: `, error);
    }
  }
  
  // If we get here, no token was found in either storage
  if (browserInfo.isSafari || browserInfo.isIOS) {
    console.warn(`No admin token found in any storage on ${browserInfo.isIOS ? 'iOS' : 'Safari'} device`);
  }
  
  return null;
};

// Helper function to set admin token with fallback
export const setAdminToken = (token) => {
  let tokenSetSuccessfully = false;
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Not in browser environment, cannot set admin token');
    return;
  }
  
  const browserInfo = getBrowserInfo();
  
  console.log(`Setting admin token on ${browserInfo.type}`);
  
  if (browserInfo.isPrivateMode) {
    console.log('Private browsing mode detected');
  }
  
  try {
    // First try to write a test value to check if sessionStorage is actually writable
    sessionStorage.setItem('test-write', '1');
    sessionStorage.removeItem('test-write');
    
    // If we get here, sessionStorage is working
    sessionStorage.setItem('adminToken', token);
    console.log('Admin token set in sessionStorage');
    tokenSetSuccessfully = true;
  } catch (error) {
    // Fallback to localStorage if sessionStorage fails
    console.warn('SessionStorage failed for admin token, using localStorage fallback:', error);
    try {
      // First try to write a test value to check if localStorage is actually writable
      localStorage.setItem('test-write', '1');
      localStorage.removeItem('test-write');
      
      // If we get here, localStorage is working
      localStorage.setItem('adminToken', token);
      console.log('Admin token set in localStorage (fallback)');
      tokenSetSuccessfully = true;
    } catch (localStorageError) {
      console.error('All storage methods failed for admin token:', localStorageError);
      
      // Log detailed error for debugging
      if (browserInfo.isSafari || browserInfo.isIOS) {
        console.error(`Storage failure on ${browserInfo.isIOS ? 'iOS' : 'Safari'} for admin token: `, localStorageError);
      }
    }
  }
  return tokenSetSuccessfully;
};
