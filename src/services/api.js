import axiosInstance from './axiosInstance.js';

const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_PROFILE: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
  },
  HOTELS: {
    SEARCH: '/hotels/search',
    GET_ALL: '/hotels',
    GET_BY_ID: (id) => `/hotels/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings',
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
    const response = await axiosInstance.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
