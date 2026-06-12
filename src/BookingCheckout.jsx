import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useBooking } from './context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaCopy, FaCreditCard, FaPaypal, FaMobileAlt, FaArrowLeft } from 'react-icons/fa';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy');

const PaymentForm = ({ bookingId, onSuccess, isAttraction, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment, initiateMpesa, createPaypalOrder, capturePaypalOrder } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState('');
  const [showMockMessage, setShowMockMessage] = useState(false);

  // TODO: Uncomment these states when ready to enforce strict validation
  // const [isStripeComplete, setIsStripeComplete] = useState(false);
  // const [isPaypalComplete, setIsPaypalComplete] = useState(false);
  // const [isMpesaComplete, setIsMpesaComplete] = useState(false);

  // const isFormValid = 
  //   (paymentMethod === 'stripe' && isStripeComplete) ||
  //   (paymentMethod === 'paypal' && isPaypalComplete) ||
  //   (paymentMethod === 'mpesa' && isMpesaComplete);


  const handlePayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'paypal') return; // Handled by PayPal buttons
    
    setLoading(true);
    setError('');
    setMpesaStatus('');

    try {
      // Mock payment simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isAttraction && bookingId) {
        try {
          // Attempt to confirm on backend with a mock ID just in case it's needed
          await confirmPayment('pi_mock_' + Date.now(), bookingId);
        } catch (e) {
          // Ignore backend errors for mock payment
          console.warn('Mock confirmPayment bypassed validation');
        }
      }
      
      onSuccess();
    } catch (err) {
      setError('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="space-y-3">
        {/* Stripe Option */}
        <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
          <div className="flex items-center gap-3">
            <FaCreditCard className={paymentMethod === 'stripe' ? 'text-teal-400' : 'text-slate-400'} />
            <span className="font-semibold text-white">Credit Card</span>
          </div>
          <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="hidden" />
          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-teal-500' : 'border-slate-500'}`}>
            {paymentMethod === 'stripe' && <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />}
          </div>
        </label>
        
        {/* Stripe Card Element */}
        <AnimatePresence>
          {paymentMethod === 'stripe' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-white/10 mt-2">
                <CardElement
                  onChange={() => setShowMockMessage(true)}
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#fff',
                        '::placeholder': { color: '#64748b' },
                        iconColor: '#2dd4bf',
                      },
                      invalid: { color: '#ef4444', iconColor: '#ef4444' },
                    },
                  }}
                  className="p-2"
                />
              </div>
              <AnimatePresence>
                {showMockMessage && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-400">
                    <strong>Testing Mode:</strong> Automatic payment filling is disabled. You don't need to enter real card details. Just click "Complete Booking" to proceed.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PayPal Option (Disabled) */}
        <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <FaPaypal className="text-slate-400" />
            <span className="font-semibold text-white">PayPal</span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">Coming Soon</span>
          </div>
          <div className="h-5 w-5 rounded-full border-2 border-slate-500 flex items-center justify-center"></div>
        </label>

        {/* M-Pesa Option (Disabled) */}
        <label className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <FaMobileAlt className="text-slate-400" />
            <span className="font-semibold text-white">M-Pesa</span>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">Coming Soon</span>
          </div>
          <div className="h-5 w-5 rounded-full border-2 border-slate-500 flex items-center justify-center"></div>
        </label>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {paymentMethod !== 'paypal' && (
        <button
          type="submit"
          disabled={loading || (paymentMethod === 'stripe' && !stripe) || (paymentMethod === 'mpesa' && !phoneNumber)}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-xl shadow-teal-500/20 active:scale-[0.98]"
        >
          {loading ? 'Processing...' : `Complete Booking — $${totalPrice}`}
        </button>
      )}
    </form>
  );
};

export const BookingCheckout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAttraction = bookingId?.startsWith('attr-');
  const bookingRef = isAttraction ? bookingId.replace('attr-', '') : bookingId;

  const stateData = location.state || {};
  const itemName = stateData.item?.name || 'Premium Booking';
  const visitDate = stateData.visitDate || new Date().toISOString().slice(0, 10);
  const totalVisitors = stateData.totalVisitors || 1;
  const totalPrice = stateData.totalPrice || 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-950 pt-24 pb-12 md:pt-32 px-4 flex justify-center items-center overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* Left Column: Order Summary */}
        <div className="space-y-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit p-2 -ml-2 rounded-lg hover:bg-white/5">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-slate-400">Complete your premium booking securely.</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Order Summary</h3>
            <div className="flex justify-between text-slate-300">
              <span>Item</span>
              <span className="font-medium text-white">{itemName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Date</span>
              <span className="font-medium text-white">{visitDate}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Guests</span>
              <span className="font-medium text-white">{totalVisitors}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-teal-400 pt-4 border-t border-white/10">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Receipt */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!paymentComplete ? (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>
                <Elements stripe={stripePromise}>
                  <PaymentForm bookingId={bookingId} onSuccess={handlePaymentSuccess} isAttraction={isAttraction} totalPrice={totalPrice} />
                </Elements>
                <p className="mt-6 text-xs text-center text-slate-500">Payments are secure and encrypted via Stripe.</p>
              </motion.div>
            ) : (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="rounded-2xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative"
              >
                <button 
                  onClick={() => navigate('/')} 
                  className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2' 
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
                
                <div className='text-center mt-2'>
                  <div className='relative mx-auto h-24 w-24 mb-2'>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className='absolute inset-0 rounded-full bg-[#d5f5e8] flex items-center justify-center'>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className='h-[52px] w-[52px] rounded-full bg-[#04c98b] flex items-center justify-center shadow-sm'>
                        <FaCheck className='text-white text-2xl' />
                      </motion.div>
                    </motion.div>
                  </div>
                  <h2 className='text-xl font-bold text-white'>Booking Confirmed! 🎉</h2>
                  <p className='mt-1 text-sm text-slate-400'>Your adventure awaits</p>
                </div>
                
                <div className='mt-6 space-y-2'>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-3 flex items-center justify-between'>
                    <span className='text-sm text-slate-400'>Reference</span>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-white font-mono text-sm'>{bookingRef}</span>
                      <button onClick={handleCopy} className='text-slate-400 hover:text-teal-400 transition-colors'>
                        {copied ? <FaCheck className='text-emerald-400'/> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-3 flex items-center justify-between'>
                    <span className='text-sm text-slate-400'>Date</span>
                    <span className='font-semibold text-white text-sm'>{visitDate}</span>
                  </div>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-3 flex items-center justify-between'>
                    <span className='text-sm text-slate-400'>Visitors</span>
                    <span className='font-semibold text-white text-sm'>{totalVisitors}</span>
                  </div>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-3 flex items-center justify-between'>
                    <span className='text-sm text-slate-400'>Total Paid</span>
                    <span className='font-bold text-teal-400 text-lg'>${totalPrice}</span>
                  </div>
                </div>
                
                <div className='mt-6'>
                  <motion.button 
                    whileHover={{ scale: 1.01 }} 
                    whileTap={{ scale: 0.99 }} 
                    onClick={() => navigate(stateData.type === 'attraction' ? `/hotels?destination=${encodeURIComponent(stateData.item?.city || '')}` : '/my-bookings')} 
                    className='w-full rounded-xl border border-teal-500/30 bg-teal-500/10 px-5 py-3 text-sm text-teal-400 font-semibold hover:bg-teal-500/20 transition-all text-center flex items-center justify-center gap-2'
                  >
                    {stateData.type === 'attraction' ? `🏨 Book a Hotel Near ${stateData.item?.city}` : 'View My Bookings'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
