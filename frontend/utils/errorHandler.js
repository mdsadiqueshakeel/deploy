/**
 * Utility functions for handling errors consistently across the application
 */

import { toast } from 'react-toastify';

/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from the API call
 * @param {Function} router - Next.js router instance for navigation if needed
 * @param {Object} options - Additional options
 * @param {boolean} options.redirect - Whether to redirect to an error page
 * @param {string} options.redirectPath - Path to redirect to (default: '/dashboard/error')
 * @param {boolean} options.showToast - Whether to show a toast notification
 * @param {string} options.customMessage - Custom error message to display
 */
export const handleApiError = (error, router, options = {}) => {
  const {
    redirect = false,
    redirectPath = '/dashboard/error',
    showToast = true,
    customMessage = null,
  } = options;

  // Get error message from response or use a default
  const errorMessage = 
    customMessage || 
    (error.response?.data?.message) || 
    (error.response?.data?.error) || 
    error.message || 
    'An unexpected error occurred';

  // Log the error for debugging
  console.error('API Error:', error);

  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }

  // Redirect to error page if enabled
  if (redirect && router) {
    router.push({
      pathname: redirectPath,
      query: { message: errorMessage },
    });
  }

  return errorMessage;
};

/**
 * Formats validation errors from the API into a readable format
 * @param {Object} validationErrors - Validation errors object from the API
 * @returns {string} Formatted validation errors
 */
export const formatValidationErrors = (validationErrors) => {
  if (!validationErrors) return '';
  
  // If it's already a string, return it
  if (typeof validationErrors === 'string') return validationErrors;
  
  // If it's an array, join the messages
  if (Array.isArray(validationErrors)) {
    return validationErrors.join(', ');
  }
  
  // If it's an object, format each field's errors
  if (typeof validationErrors === 'object') {
    return Object.entries(validationErrors)
      .map(([field, errors]) => {
        // Handle nested arrays of errors
        const errorMessages = Array.isArray(errors) ? errors.join(', ') : errors;
        return `${field}: ${errorMessages}`;
      })
      .join('; ');
  }
  
  return 'Invalid form data';
};

/**
 * Redirects to the appropriate error page based on the error status
 * @param {Error} error - The error object
 * @param {Function} router - Next.js router instance
 */
export const redirectToErrorPage = (error, router) => {
  const status = error.response?.status;
  
  if (status === 404) {
    router.push('/404');
  } else if (status >= 500) {
    router.push('/500');
  } else {
    // For other errors, go to the dashboard error page with the message
    const errorMessage = 
      (error.response?.data?.message) || 
      (error.response?.data?.error) || 
      error.message || 
      'An unexpected error occurred';
      
    router.push({
      pathname: '/dashboard/error',
      query: { message: errorMessage },
    });
  }
};