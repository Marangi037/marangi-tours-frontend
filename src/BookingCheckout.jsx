import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useBooking } from './context/BookingContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(bookingId);

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await confirmPayment(result.paymentIntent.id, bookingId);
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <h3 className="text-lg font-bold mb-4">Card Details</h3>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
          className="p-3 border rounded"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white py-3 rounded font-bold uppercase disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export const BookingCheckout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      navigate('/my-bookings');
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">✓ Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">Your booking has been confirmed.</p>
          <p className="text-gray-500">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Elements stripe={stripePromise}>
          <PaymentForm bookingId={bookingId} onSuccess={handlePaymentSuccess} />
        </Elements>

        <div className="bg-blue-50 p-4 rounded mt-6">
          <p className="text-sm text-blue-800">
            <strong>Test Card:</strong> 4242 4242 4242 4242 (Any future date, any CVC)
          </p>
        </div>
      </div>
    </div>
  );
};
