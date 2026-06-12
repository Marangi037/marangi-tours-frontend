import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';
import OTPInput from '../components/OTPInput.jsx';
import { Mail } from 'lucide-react';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!email) {
    return <Navigate to="/signup" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/verify-email', { email, code: fullCode });
      navigate('/login', { state: { message: 'Email verified! You can now sign in.' } });
    } catch (err) {
      if (err.response?.status === 410) {
        setError('Code expired. Request a new one.');
      } else {
        setError(err.response?.data?.error || 'Invalid code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendLoading(true);
    setError('');
    try {
      await axiosInstance.post('/auth/resend-verification', { email });
      setResendTimer(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      // Handle resend error silently or generic
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 p-5 sm:p-6 text-center">
        
        <div className="flex justify-center mb-4">
          <Mail size={48} className="text-teal-400" />
        </div>

        <div className='flex items-center justify-center gap-3 mb-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>Email Verification</p>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-white">Verify Your Email</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          We sent a 6-digit code to <span className="font-bold text-teal-400">{email}</span>. Enter it below to activate your account.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-2">
            <OTPInput value={code} onChange={(newCode) => { setCode(newCode); setError(''); }} error={!!error} />
            {error && (
              <p className="text-red-400 text-xs mt-3 text-center font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || code.join('').length < 6}
            className="w-full h-[44px] mt-2 rounded-xl bg-white text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500 mb-2">Didn't receive it?</p>
          {resendTimer > 0 ? (
            <span className="text-slate-400 font-medium">Resend in 00:{resendTimer.toString().padStart(2, '0')}</span>
          ) : (
            <button 
              onClick={handleResend}
              disabled={resendLoading}
              className="text-teal-400 hover:underline font-medium focus:outline-none disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          )}
          {resendSuccess && (
            <p className="text-green-400 text-xs mt-2 font-medium">Code resent!</p>
          )}
        </div>
      </div>
    </section>
  );
};
