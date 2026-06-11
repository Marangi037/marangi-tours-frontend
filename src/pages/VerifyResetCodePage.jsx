import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';
import OTPInput from '../components/OTPInput.jsx';

export const VerifyResetCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
    return <Navigate to="/forgot-password" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-reset-code', { email, code: fullCode });
      const resetToken = response.data.resetToken || response.data.token; // Handle standard setups
      navigate('/reset-password', { state: { email, resetToken } });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setResendLoading(true);
    setError(false);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setResendTimer(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      // Handle resend error silently or show a generic error
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 p-5 sm:p-6">
        <div className='flex items-center gap-3 mb-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>Verification</p>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-white">Enter Code</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          We sent a 6-digit code to <span className="font-bold text-teal-400">{email}</span>. Check your inbox — it may take a minute.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-2">
            <OTPInput value={code} onChange={(newCode) => { setCode(newCode); setError(false); }} error={error} />
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">Invalid or expired code. Please try again.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || code.join('').length < 6}
            className="w-full h-[44px] mt-2 rounded-xl bg-secondary text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
                Verifying...
              </>
            ) : (
              'Verify Code'
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
