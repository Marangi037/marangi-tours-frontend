import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCreditCard, FaSignOutAlt, FaLock, FaArrowLeft } from 'react-icons/fa';

export const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    nationality: ''
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
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        nationality: user.nationality || ''
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <section className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_20%),linear-gradient(180deg,_#08101f_0%,_#0d203b_100%)] pt-32 pb-16 px-4'>
      <div className='mx-auto max-w-5xl'>
        <button 
          onClick={() => navigate(-1)} 
          className='mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-teal-400 transition-all group'
        >
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-teal-500/10 group-hover:border-teal-500/30 transition-all'>
            <FaArrowLeft className='text-xs' />
          </div>
          Back
        </button>

        <div className='mb-10'>
          <p className='text-sm uppercase tracking-[0.3em] text-secondary'>Your Account</p>
          <h1 className='mt-3 text-4xl font-semibold text-[var(--color-text)]'>Settings & Profile</h1>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          
          {/* Main Info Form */}
          <form onSubmit={handleSubmit} className='md:col-span-2 space-y-8'>
            <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl p-8'>
              <h2 className='text-2xl font-semibold text-white mb-6 flex items-center gap-3'>
                <FaUser className='text-teal-400' /> Personal Details
              </h2>
              
              {successMsg && <div className='mb-6 p-4 bg-teal-500/20 border border-teal-500/50 rounded-xl text-teal-300 text-sm'>{successMsg}</div>}
              {errorMsg && <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm'>{errorMsg}</div>}

              <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>First Name</label>
                    <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Last Name</label>
                    <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Email Address</label>
                  <div className='relative'>
                    <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                    <input type='email' name='email' value={formData.email} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' required />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Phone Number</label>
                  <div className='relative'>
                    <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500' />
                    <input type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' placeholder='+1 234 567 8900' />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Details */}
            <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl p-8'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-semibold text-white flex items-center gap-3'>
                  <FaUser className='text-teal-400' /> Additional Details
                </h2>
              </div>
              
              <div className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Birthday</label>
                    <input type='date' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Gender</label>
                    <div className="relative">
                      <select name='gender' value={formData.gender} onChange={handleChange} className='w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm'>
                        <option value='' className='bg-[#0d203b]'>Select Gender</option>
                        <option value='Male' className='bg-[#0d203b]'>Male</option>
                        <option value='Female' className='bg-[#0d203b]'>Female</option>
                        <option value='Non-binary' className='bg-[#0d203b]'>Non-binary</option>
                        <option value='Other' className='bg-[#0d203b]'>Other</option>
                        <option value='Prefer not to say' className='bg-[#0d203b]'>Prefer not to say</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Nationality</label>
                  <input type='text' name='nationality' value={formData.nationality} onChange={handleChange} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white/10 transition-all text-sm' placeholder='e.g., American, Canadian, etc.' />
                </div>

                <div className='pt-4 flex justify-end'>
                  <button type='submit' disabled={loading} className='w-full sm:w-auto btn-primary rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50'>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>

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
