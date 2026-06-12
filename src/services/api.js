import axiosInstance from './axiosInstance.js';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://marangi-tours-backend.onrender.com/api';

const adminAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['X-Admin-Token'] = adminToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect to /login here so AdminLayout can handle it
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('admin_verified');
    }
    return Promise.reject(error);
  }
);

const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_PROFILE: '/auth/me',
    UPDATE_PROFILE: '/users/me',
    LOGOUT: '/auth/logout',
  },
  HOTELS: {
    SEARCH: '/hotels/search',
    GET_ALL: '/hotels',
    GET_BY_ID: (id) => `/hotels/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings',
    GET_MY: '/bookings/my',
    GET_BY_ID: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  REVIEWS: {
    CREATE: '/reviews',
    GET_HOTEL_REVIEWS: (hotelId) => `/reviews/hotel/${hotelId}`,
    GET_MY_REVIEWS: '/reviews/user/my-reviews',
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
  },
  DESTINATIONS: {
    GET_ALL: '/destinations',
    GET_BY_ID: (id) => `/destinations/${id}`,
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
    MPESA_INITIATE: '/payments/mpesa/initiate',
    PAYPAL_CREATE_ORDER: '/payments/paypal/create-order',
    PAYPAL_CAPTURE_ORDER: '/payments/paypal/capture-order',
  },
  SEARCH: {
    LOG: '/search/log',
    TRENDING: '/search/trending',
  },
};

// Auth Services
export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.GET_PROFILE);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

// Hotel Services
export const hotelService = {
  searchHotels: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.HOTELS.SEARCH, { params });
    return response.data;
  },

  getAllHotels: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.HOTELS.GET_ALL);
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.HOTELS.GET_BY_ID(id));
    return response.data;
  },
};

// Booking Services
export const bookingService = {
  createBooking: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CREATE, data);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_ALL);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_MY);
    return response.data.data; // Return just the array
  },

  getBookingById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_BY_ID(id));
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
    return response.data;
  },
};

// Review Services
export const reviewService = {
  createReview: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, data);
    return response.data;
  },

  getHotelReviews: async (hotelId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_HOTEL_REVIEWS(hotelId));
    return response.data;
  },

  getMyReviews: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_MY_REVIEWS);
    return response.data;
  },

  updateReview: async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.REVIEWS.UPDATE(id), data);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
    return response.data;
  },
};

// Destination Services
export const destinationService = {
  getAllDestinations: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DESTINATIONS.GET_ALL);
    return response.data;
  },

  getDestinationById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.DESTINATIONS.GET_BY_ID(id));
    return response.data;
  },
};

// Payment Services
export const paymentService = {
  createPaymentIntent: async (bookingId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE_INTENT, { bookingId });
    return response.data;
  },

  confirmPayment: async (paymentIntentId, bookingId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.CONFIRM, {
      paymentIntentId,
      bookingId,
    });
    return response.data;
  },

  initiateMpesa: async (data) => {
    // data: { booking_id, phone_number, amount }
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.MPESA_INITIATE, data);
    return response.data;
  },

  createPaypalOrder: async (data) => {
    // data: { booking_id, amount, currency }
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.PAYPAL_CREATE_ORDER, data);
    return response.data;
  },

  capturePaypalOrder: async (data) => {
    // data: { orderID, booking_id }
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.PAYPAL_CAPTURE_ORDER, data);
    return response.data;
  },
};

// Search Services
export const searchService = {
  logSearch: async (query, locale = 'en') => {
    try {
      await axiosInstance.post(API_ENDPOINTS.SEARCH.LOG, { query, locale });
    } catch (e) {
      // Fire and forget, ignore errors
      console.warn('Failed to log search', e);
    }
  },
  
  getTrending: async (locale = 'en') => {
    const response = await axiosInstance.get(API_ENDPOINTS.SEARCH.TRENDING, { params: { locale } });
    return response.data;
  }
};

// Admin Services
export const adminService = {
  verifyPassword: async (password) => {
    const response = await adminAxiosInstance.post('/admin/verify-password', { password });
    return response.data;
  },
  forgotPassword: async () => {
    const response = await adminAxiosInstance.post('/admin/forgot-password');
    return response.data;
  },
  resetPassword: async (code, newPassword) => {
    const response = await adminAxiosInstance.post('/admin/reset-password', { code, newPassword });
    return response.data;
  },
  getStats: async () => {
    const response = await adminAxiosInstance.get('/admin/stats');
    return response.data;
  },
  getBookings: async () => {
    const response = await adminAxiosInstance.get('/admin/bookings');
    return response.data;
  },
  getUsers: async () => {
    const response = await adminAxiosInstance.get('/admin/users');
    return response.data;
  },
  getDestinations: async () => {
    const response = await adminAxiosInstance.get('/admin/destinations');
    return response.data;
  },
  addDestination: async (data) => {
    const response = await adminAxiosInstance.post('/admin/destinations', data);
    return response.data;
  },
  getHotels: async () => {
    const response = await adminAxiosInstance.get('/admin/hotels');
    return response.data;
  },
  addHotel: async (data) => {
    const response = await adminAxiosInstance.post('/admin/hotels', data);
    return response.data;
  },
  getBlogs: async () => {
    const response = await adminAxiosInstance.get('/admin/blogs');
    return response.data;
  },
  addBlog: async (data) => {
    const response = await adminAxiosInstance.post('/admin/blogs', data);
    return response.data;
  },
  getTestimonials: async () => {
    const response = await adminAxiosInstance.get('/admin/testimonials');
    return response.data;
  },
  addTestimonial: async (data) => {
    const response = await adminAxiosInstance.post('/admin/testimonials', data);
    return response.data;
  },
  getContacts: async () => {
    const response = await adminAxiosInstance.get('/admin/contacts');
    return response.data;
  },
  getPayments: async () => {
    const response = await adminAxiosInstance.get('/admin/payments');
    return response.data;
  }
};
