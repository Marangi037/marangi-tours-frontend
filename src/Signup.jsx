import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaCheck, FaChevronLeft } from 'react-icons/fa';

export const Signup = () => {
  const navigate = useNavigate();
  const { register, error: authError, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setFormError('Please complete all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      await register(email, password, firstName, lastName);
      navigate('/verify-email', { state: { email } });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to sign up. Please try again.';
      if (errorMsg === 'Email already registered') {
        navigate('/login', { state: { toastMessage: 'Account already exists. Please sign in.' } });
      } else {
        setFormError(errorMsg);
      }
    }
  };

  const handleGoogleSignup = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://marangi-tours-backend.onrender.com/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleFacebookSignup = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://marangi-tours-backend.onrender.com/api';
    window.location.href = `${apiUrl}/auth/facebook`;
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <Link to="/" className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all z-20">
        <FaChevronLeft className="text-sm" />
      </Link>
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/2 left-3/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-[800px] my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          
          {/* Left panel */}
          <div className="md:col-span-2 bg-white/5 border-r border-white/10 p-8 flex-col justify-between hidden md:flex">
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>Join Us</p>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white leading-snug">Create<br/>Account</h1>
              <p className="text-sm text-slate-400">Sign up to start booking hotels, saving trips, and managing reservations.</p>
            </div>
            
            <div className="mt-8">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Or sign up with</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center justify-center gap-2 h-[44px] rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <FaGoogle className="text-red-400" /> Google
                </button>
                <button
                  onClick={handleFacebookSignup}
                  className="flex items-center justify-center gap-2 h-[44px] rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <FaFacebook className="text-blue-400 text-lg" /> Facebook
                </button>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="md:col-span-3 p-6 sm:p-8">
            <div className="md:hidden mb-4">
              <h1 className="text-2xl font-bold mb-1 text-white">Create Account</h1>
              <p className="text-sm text-slate-400">Sign up to start booking hotels and saving trips.</p>
            </div>

            {formError && <div className="mb-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-red-300 text-sm">{formError}</div>}
            {authError && <div className="mb-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-red-300 text-sm">{authError}</div>}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                  placeholder="you@example.com"
                />
                <div className="flex gap-1 mt-2">
                  <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${email.length === 0 ? 'bg-white/10' : isEmailValid ? 'bg-teal-500' : 'bg-red-500/50'}`}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Password</label>
                  <div className="relative h-[44px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasMinLength ? 'bg-teal-500' : 'bg-red-500/50'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasNumber ? 'bg-teal-500' : 'bg-white/10'}`}></div>
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length === 0 ? 'bg-white/10' : hasSpecialChar ? 'bg-teal-500' : 'bg-white/10'}`}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Min 8 chars, 1 num, 1 special</p>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Confirm Password</label>
                  <div className="relative h-[44px]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[44px] bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 text-white placeholder-slate-400 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                      placeholder="Confirm"
                    />
                    {passwordsMatch ? (
                      <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !firstName || !lastName || !email || !password || !confirmPassword}
                className="w-full h-[44px] mt-2 rounded-xl bg-white text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            {/* Mobile OAuth */}
            <div className="md:hidden mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Or</span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center justify-center gap-2 h-[40px] rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <FaGoogle className="text-red-400" /> Google
                </button>
                <button
                  onClick={handleFacebookSignup}
                  className="flex items-center justify-center gap-2 h-[40px] rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <FaFacebook className="text-blue-400 text-base" /> Facebook
                </button>
              </div>
            </div>

            <p className="mt-4 text-center md:text-left text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-secondary hover:text-white transition-colors">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
