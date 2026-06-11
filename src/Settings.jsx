import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCreditCard, FaSignOutAlt, FaLock } from 'react-icons/fa';

export const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <section className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_20%),linear-gradient(180deg,_#08101f_0%,_#0d203b_45%,_#f4e8d2_100%)] pt-32 pb-16 px-4'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-10'>
          <p className='text-sm uppercase tracking-[0.3em] text-secondary'>Your Account</p>
          <h1 className='mt-3 text-4xl font-semibold text-[var(--color-text)]'>Settings & Profile</h1>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          
          {/* Main Info Form */}
          <div className='md:col-span-2 space-y-8'>
            <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl p-8'>
              <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
                <FaUser className='text-teal-400' /> Personal Details
              </h2>
              
              {successMsg && <div className='mb-6 p-4 bg-teal-500/20 border border-teal-500/50 rounded-xl text-teal-300 text-sm'>{successMsg}</div>}
              {errorMsg && <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm'>{errorMsg}</div>}

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>First Name</label>
                    <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Last Name</label>
                    <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Email Address</label>
                  <div className='relative'>
                    <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                    <input type='email' name='email' value={formData.email} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Phone Number</label>
                  <div className='relative'>
                    <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                    <input type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' placeholder='+1 234 567 8900' />
                  </div>
                </div>

                <div className='pt-4 flex justify-end'>
                  <button type='submit' disabled={loading} className='w-full sm:w-auto btn-primary rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50'>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Payment Info */}
            <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl p-8'>
              <div className='flex items-center justify-between mb-2'>
                <h2 className='text-2xl font-semibold text-white flex items-center gap-3'>
                  <FaCreditCard className='text-teal-400' /> Payment Methods
                </h2>
              </div>
              <p className='text-sm text-slate-400 mb-6'>Save your payment details securely for faster checkout next time.</p>
              
              <div className='rounded-xl border border-dashed border-white/20 bg-white/5 p-6 flex flex-col items-center justify-center text-center'>
                <div className='h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-3'>
                  <FaLock className='text-teal-400 text-lg' />
                </div>
                <h3 className='text-white font-medium mb-1'>No saved cards</h3>
                <p className='text-xs text-slate-400 mb-4 max-w-xs mx-auto'>You have not added any payment methods yet. Link a card to expedite your next booking.</p>
                <button className='rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 hover:border-white/40 transition-all'>
                  + Add New Card
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Logout */}
          <div className='space-y-6'>
            <div className='rounded-[2rem] border border-red-500/20 bg-red-950/20 shadow-2xl backdrop-blur-xl p-8 sticky top-32'>
              <h3 className='text-lg font-semibold text-red-400 mb-4'>Account Actions</h3>
              <p className='text-sm text-slate-400 mb-6'>Ready to sign out? You will need to log back in to manage your bookings and wishlist.</p>
              <button 
                onClick={handleLogout}
                className='w-full flex items-center justify-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all'
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
