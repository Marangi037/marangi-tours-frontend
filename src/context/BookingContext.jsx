import React, { createContext, useState } from 'react';
import { bookingService, paymentService } from '../services/api.js';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (bookingData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await bookingService.createBooking(bookingData);
      setBookings([...bookings, response.booking]);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMyBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBookingById = async (id) => {
    try {
      setError(null);
      const response = await bookingService.getBookingById(id);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    }
  };

  const cancelBooking = async (id, reason) => {
    try {
      setError(null);
      setLoading(true);
      const response = await bookingService.cancelBooking(id, reason);
      setBookings(bookings.map(b => (b._id === id ? response.booking : b)));
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (bookingId) => {
    try {
      setError(null);
      const response = await paymentService.createPaymentIntent(bookingId);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    }
  };

  const confirmPayment = async (paymentIntentId, bookingId) => {
    try {
      setError(null);
      const response = await paymentService.confirmPayment(paymentIntentId, bookingId);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        error,
        createBooking,
        getMyBookings,
        getBookingById,
        cancelBooking,
        createPaymentIntent,
        confirmPayment,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
