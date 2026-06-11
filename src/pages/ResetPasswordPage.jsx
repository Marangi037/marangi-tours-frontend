import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetToken } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!email || !resetToken) {
    return <Navigate to="/forgot-password" />;
  }

  // Password strength logic
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaMet = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (criteriaMet < 2) return 'Weak';
    if (criteriaMet === 2) return 'Fair';
    if (criteriaMet === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-white/10';
    if (criteriaMet < 2) return 'bg-red-500';
    if (criteriaMet === 2) return 'bg-orange-500';
    if (criteriaMet === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const strengthWidth = password.length === 0 ? '0%' : `${(criteriaMet / 4) * 100}%`;
  const isWeak = criteriaMet < 3;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError('');

    if (isWeak || !passwordsMatch || password === '') {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.patch('/auth/reset-password', 
        { newPassword: password },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successfully. Please sign in.' } });
      }, 2000);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center bg-slate-950 px-4 pt-[80px] pb-6 overflow-y-auto relative">
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm my-auto bg-[rgba(8,16,31,0.85)] border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 p-5 sm:p-6 overflow-hidden">
        
        {success && (
          <div className="absolute inset-0 bg-[rgba(8,16,31,0.95)] z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <FaCheckCircle className="text-5xl text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Password updated successfully!</h2>
            <p className="text-sm text-slate-400">Redirecting you to login...</p>
          </div>
        )}

        <div className='flex items-center gap-3 mb-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-secondary uppercase'>New Password</p>
        </div>
        <h1 className="text-2xl font-bold mb-1 text-white">Reset Password</h1>
        <p className="text-sm text-slate-400 mb-6">Choose a strong password for your account.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">New Password</label>
            <div className="relative h-[44px]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary focus:outline-none transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Strength Indicator */}
            <div className="mt-2">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
                  style={{ width: strengthWidth }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-slate-400">Min 8 chars, 1 num, 1 special, 1 uppercase</p>
                {password.length > 0 && (
                  <span className={`text-[10px] font-bold uppercase ${
                    criteriaMet < 2 ? 'text-red-500' : 
                    criteriaMet === 2 ? 'text-orange-500' : 
                    criteriaMet === 3 ? 'text-yellow-400' : 'text-green-500'
                  }`}>
                    {getStrengthLabel()}
                  </span>
                )}
              </div>
            </div>
            {touched && isWeak && password.length > 0 && (
               <p className="text-red-400 text-xs mt-2">Password must be at least 8 characters with 1 number and 1 special character</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Confirm Password</label>
            <div className="relative h-[44px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-secondary transition-all text-sm"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary focus:outline-none transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched && !passwordsMatch && confirmPassword.length > 0 && (
              <p className="text-red-400 text-xs mt-2">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (touched && (isWeak || !passwordsMatch))}
            className="w-full h-[44px] mt-4 rounded-xl bg-secondary text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-primary border-t-transparent rounded-full w-4 h-4 inline-block mr-2"></span>
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl bg-red-950/50 border border-red-900/50 px-4 py-3 text-sm">
            <p className="text-red-300 mb-2">{error}</p>
            {error.includes('expired') && (
              <Link to="/forgot-password" className="text-teal-400 hover:underline font-semibold text-xs">
                Request new code
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
