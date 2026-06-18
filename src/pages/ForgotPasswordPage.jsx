import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [oauthProvider, setOauthProvider] = useState(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      navigate('/verify-reset-code', { state: { email } });
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Something went wrong. Please try again.';
      if (errMsg.includes('linked to Google')) {
        setOauthProvider('Google');
      } else if (errMsg.includes('linked to Facebook')) {
        setOauthProvider('Facebook');
      } else if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 p-5 sm:p-6">
        <div className='flex items-center gap-3 mb-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>Account Recovery</p>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-white">Forgot Password</h1>
        <p className="text-sm text-slate-400 mb-6">Enter the email linked to your account and we'll send you a verification code.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
              placeholder="you@example.com"
            />
            <div className="flex gap-1 mt-2">
              <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${email.length === 0 ? 'bg-white/10' : isEmailValid ? 'bg-teal-500' : 'bg-red-500/50'}`}></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] mt-2 rounded-xl bg-white text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
                Sending...
              </>
            ) : (
              'Send Code'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-secondary hover:text-white transition-colors">
            &larr; Back to Login
          </Link>
        </div>
      </div>

      {oauthProvider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[rgba(8,16,31,0.95)] border border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative animate-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              {oauthProvider === 'Google' ? <FaGoogle className="text-3xl text-red-400" /> : <FaFacebook className="text-3xl text-blue-400" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Linked to {oauthProvider}</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              This email address was registered using your {oauthProvider} account. You don't need a password to sign in!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const apiUrl = import.meta.env.VITE_API_URL || 'https://marangi-tours-backend.onrender.com/api';
                  window.location.href = `${apiUrl}/auth/${oauthProvider.toLowerCase()}`;
                }}
                className={`w-full h-[48px] rounded-xl text-white font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${oauthProvider === 'Google' ? 'bg-red-500/10 border border-red-500/20 text-red-100 hover:bg-red-500/20' : 'bg-blue-500/10 border border-blue-500/20 text-blue-100 hover:bg-blue-500/20'}`}
              >
                {oauthProvider === 'Google' ? <FaGoogle className="text-red-400 text-lg" /> : <FaFacebook className="text-blue-400 text-lg" />}
                Log in with {oauthProvider}
              </button>
              <button
                onClick={() => setOauthProvider(null)}
                className="w-full h-[48px] rounded-xl text-slate-400 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
