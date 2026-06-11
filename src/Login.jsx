import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaChevronLeft } from 'react-icons/fa';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAuth();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Unable to log in. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login placeholder");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login placeholder");
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <Link to="/" className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all z-20">
        <FaChevronLeft className="text-sm" />
      </Link>
      {/* Background decoration to match aesthetic */}
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 p-5 sm:p-6">
        <div className='flex items-center gap-3 mb-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>Welcome Back</p>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-white">Login</h1>
        <p className="text-sm text-slate-400 mb-4">Access your travel bookings.</p>

        {successMessage && (
          <div className="mb-4 rounded-xl bg-green-950/50 border border-green-900/50 px-4 py-3 text-green-300 text-sm flex justify-between items-center">
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="text-green-500 hover:text-green-300 font-bold">&times;</button>
          </div>
        )}

        {formError && <div className="mb-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-red-300 text-sm">{formError}</div>}
        {authError && <div className="mb-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-red-300 text-sm">{authError}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
              placeholder="you@example.com"
            />
            <div className="flex gap-1 mt-2">
              <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${email.length === 0 ? 'bg-white/10' : isEmailValid ? 'bg-teal-500' : 'bg-red-500/50'}`}></div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Password</label>
            <div className="relative h-[44px]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-1 flex-1 mr-4">
                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasMinLength ? 'bg-teal-500' : 'bg-red-500/50'}`}></div>
                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasNumber ? 'bg-teal-500' : 'bg-white/10'}`}></div>
                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasSpecialChar ? 'bg-teal-500' : 'bg-white/10'}`}></div>
              </div>
              <Link to="/forgot-password" className="text-xs font-medium text-secondary hover:text-white transition-colors whitespace-nowrap">Forgot password?</Link>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Min 8 chars, 1 num, 1 special</p>
          </div>

          <button
            type="submit"
            disabled={loading || !isEmailValid || !hasMinLength || !hasNumber || !hasSpecialChar}
            className="w-full h-[44px] mt-2 rounded-xl bg-secondary text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Or</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 h-[40px] rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
          >
            <FaGoogle className="text-red-400" /> Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2 h-[40px] rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
          >
            <FaFacebook className="text-blue-400 text-lg" /> Facebook
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="font-semibold text-secondary hover:text-white transition-colors">Sign up</Link>
        </p>
      </div>
    </section>
  );
};
