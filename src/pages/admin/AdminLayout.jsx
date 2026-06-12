import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { adminService } from '../../services/api';
import { FaLock, FaEnvelope, FaKey, FaArrowRight } from 'react-icons/fa';

export const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode as per NeuroBank design
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot password states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email sent, 2: Enter code & new password
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminService.verifyPassword(password);
      localStorage.setItem('adminToken', res.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid master password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await adminService.forgotPassword();
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminService.resetPassword(resetCode, newPassword);
      setMessage('Password successfully reset. You can now login.');
      setIsForgotMode(false);
      setStep(1);
      setPassword('');
      setNewPassword('');
      setResetCode('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
              <FaLock className="text-2xl text-teal-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Gateway</h2>
          
          {!isForgotMode ? (
            <>
              <p className="text-slate-400 text-center text-sm mb-8">Enter the master password to access the dashboard.</p>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <div className="relative">
                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Master Password"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
                {message && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">{message}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : 'Enter Dashboard'} <FaArrowRight className="text-sm" />
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button onClick={() => { setIsForgotMode(true); setError(''); setMessage(''); }} className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                  Forgot master password?
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-center text-sm mb-8">
                {step === 1 ? "Click below to send a recovery code to your registered admin email." : "Enter the code sent to your email and your new password."}
              </p>

              {step === 1 ? (
                <div className="space-y-6">
                  {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
                  
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Send Recovery Code'} <FaEnvelope className="text-sm" />
                  </button>
                  
                  <div className="mt-6 text-center">
                    <button onClick={() => { setIsForgotMode(false); setError(''); }} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Back to login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="6-digit Code"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    required
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Master Password"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    required
                  />

                  {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
                  {message && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">{message}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center gap-2"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <button type="button" onClick={() => { setIsForgotMode(false); setStep(1); }} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-theme ${isDarkMode ? 'dark' : ''} flex min-h-screen font-inter`}>
      <AdminSidebar onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="flex-1 max-h-screen overflow-y-auto bg-[var(--admin-bg)] transition-colors">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
