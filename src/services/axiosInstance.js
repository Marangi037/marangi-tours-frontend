import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://marangi-tours-backend.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Format error message to prevent raw status codes from leaking to the UI
    let friendlyMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      if (error.response.data && (error.response.data.message || error.response.data.error)) {
        // Backend sent a specific error message, we can use it
        friendlyMessage = error.response.data.message || error.response.data.error;
      } else {
        // Fallback to friendly status messages instead of "Request failed with status code XXX"
        switch (error.response.status) {
          case 400: friendlyMessage = 'Invalid request. Please check your information and try again.'; break;
          case 401: friendlyMessage = 'Please log in to continue.'; break;
          case 403: friendlyMessage = 'You do not have permission to perform this action.'; break;
          case 404: friendlyMessage = 'The requested information was not found.'; break;
          case 409: friendlyMessage = 'A conflict occurred with your request. Please try again.'; break;
          case 422: friendlyMessage = 'Invalid data provided. Please check your input.'; break;
          case 429: friendlyMessage = 'Too many requests. Please wait a moment and try again.'; break;
          case 500: friendlyMessage = 'Our servers are experiencing issues. Please try again later.'; break;
          case 502: friendlyMessage = 'Bad gateway. The server is temporarily down.'; break;
          case 503: friendlyMessage = 'Service is temporarily unavailable. Please try again later.'; break;
          case 504: friendlyMessage = 'The request timed out. Please check your connection and try again.'; break;
          default: friendlyMessage = 'An error occurred while processing your request.'; break;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      friendlyMessage = 'Unable to reach the server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      friendlyMessage = 'An error occurred while setting up the request.';
    }

    // Overwrite the default axios error message
    error.message = friendlyMessage;

    return Promise.reject(error);
  }
);

export default axiosInstance;
