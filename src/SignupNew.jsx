import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

export const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, firstName, lastName);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-screen min-w-[400px] flex bg-[url('/login_bg.jpg')] bg-cover bg-center justify-center items-center bg-white lg:bg-none">
      <div className='w-[80%] h-[60%] lg:w-[60%] lg:h-[70%] text-white lg:text-black flex gap-[2rem] lg:border-2 border-black rounded-lg lg:shadow-gray-400 lg:shadow-lg overflow-hidden'>
        <div className='lg:w-1/2 w-full h-full flex justify-center items-center  bg-[rgba(0_0_0_0.3)] backdrop-blur-lg'>
          <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 w-full'>
            {error && (
              <div className="w-[80%] bg-red-500 text-white p-2 rounded text-sm">
                {error}
              </div>
            )}
            <div className='flex w-[80%] h-max gap-2'>
                <div className='w-[50%] h-max flex flex-col'>
                  <label className='text-2xl text-[var(--color-secondary)]' htmlFor="firstName">firstname</label>
                  <input 
                    type="text" 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className='w-full h-[40px] px-4 text-[var(--color-primary)] bg-[rgba(255,255,255,0.92)] rounded-2xl outline-0'
                    required
                  />
              </div>
              <div className='w-[50%] h-max flex flex-col'>
                <label className='text-2xl text-[var(--color-secondary)]' htmlFor="lastName">lastname</label>
                <input 
                  type="text" 
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full h-[40px] px-4 text-[var(--color-primary)] bg-[rgba(255,255,255,0.92)] rounded-2xl outline-0'
                  required
                />
              </div>
            </div>
            
            <div className='w-[80%] h-max flex flex-col'>
              <label className='text-2xl text-[var(--color-secondary)]' htmlFor="email">email</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full h-[40px] px-4 text-[var(--color-primary)] bg-[rgba(255,255,255,0.92)] rounded-2xl outline-0'
                required
              />
            </div>
            <div className='w-[80%] h-max flex flex-col'>
              <label className='text-2xl text-[var(--color-secondary)]' htmlFor="password">password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full h-[40px] px-4 text-[var(--color-primary)] bg-[rgba(255,255,255,0.92)] rounded-2xl outline-0'
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className='btn-primary rounded-full text-base lg:text-xl font-bold uppercase w-[140px] h-[44px] text-white disabled:opacity-50'
            >
              {loading ? 'Signing...' : 'signup'}
            </button>
            <h1 className='text-2xl'>already have an account? <Link className='signup_link' to={"/login"}>login</Link></h1>
          </form>

        </div>
        <div className='hidden lg:flex h-full w-1/2'>
           <svg width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="none">
              <defs>
                <pattern id="imgPattern" patternUnits="userSpaceOnUse" width="500" height="500">
                  <image xlinkHref="/login_bg.jpg" width="500" height="500" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>

              <g transform="scale(-1,1) translate(-500,0)">
                <path
                  d="
                    M0,0 
                    L450,0
                    C380,100 380,150 450,250
                    C520,350 520,400 450,500
                    L0,500 Z"
                  fill="url(#imgPattern)"
                />
              </g>
            </svg>
        </div>
      </div>
    </section>
  );
};
