import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useBooking } from './context/BookingContext';

export const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const { bookings, getMyBookings, cancelBooking, loading, error } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    getMyBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-10 text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-[var(--color-primary)]">My Bookings</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-[rgba(255,255,255,0.08)] border border-white/10 p-8 rounded-[2rem] shadow-2xl text-center">
            <p className="text-lg text-[var(--color-muted)] mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-6 py-2 rounded-full font-semibold"
            >
              Search Hotels
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-[rgba(255,255,255,0.08)] border border-white/10 p-6 rounded-[2rem] shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[var(--color-muted)] text-sm">Booking Number</p>
                    <p className="font-semibold text-lg text-[var(--color-primary)]">{booking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-muted)] text-sm">Hotel</p>
                    <p className="font-semibold text-[var(--color-text)]">{booking.hotel?.name}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-muted)] text-sm">Status</p>
                    <p className={`font-semibold ${
                      booking.status === 'confirmed' ? 'text-emerald-400' :
                      booking.status === 'cancelled' ? 'text-rose-400' :
                      'text-[var(--color-secondary)]'
                    }`}>
                      {booking.status?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-t border-b border-white/10 mb-4 text-[var(--color-muted)]">
                  <div>
                    <p className="text-sm">Check-in</p>
                    <p className="font-semibold text-[var(--color-text)]">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">Check-out</p>
                    <p className="font-semibold text-[var(--color-text)]">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">Guests</p>
                    <p className="font-semibold text-[var(--color-text)]">{booking.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm">Total Price</p>
                    <p className="font-semibold text-[var(--color-secondary)]">${booking.totalPrice}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/hotel/${booking.hotel?._id}`)}
                    className="btn-secondary px-4 py-2 rounded-full font-semibold hover:bg-white/10"
                  >
                    View Hotel
                  </button>
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this booking?')) {
                          cancelBooking(booking._id, 'User cancelled');
                        }
                      }}
                      className="bg-rose-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-rose-400"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
