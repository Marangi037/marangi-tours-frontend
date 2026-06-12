import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api.js';

export const OAuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (token) {
        try {
          // Temporarily store token so the axios instance can use it for the next request
          localStorage.setItem('token', token);
          
          // Fetch the user profile using the new token
          const userData = await authService.getCurrentUser();
          
          // Save user data
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Force a full reload to the home page to re-initialize the app state with the new user
          window.location.href = '/';
        } catch (error) {
          console.error('OAuth callback failed:', error);
          localStorage.removeItem('token');
          navigate('/login', { state: { message: 'Authentication failed. Please try again.' } });
        }
      } else {
        navigate('/login', { state: { message: 'No authentication token received.' } });
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold tracking-wide">Completing authentication...</p>
      </div>
    </div>
  );
};
