import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-secondary mb-4 drop-shadow-[0_0_15px_rgba(30,186,220,0.5)]">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-primary text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95"
        >
          Return Home
        </Link>
      </div>
      
      {/* Background decoration */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
