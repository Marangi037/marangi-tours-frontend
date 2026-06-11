import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShieldAlt, FaCalendarCheck } from 'react-icons/fa';

export const Accomodation = () => {
  const navigate = useNavigate();

  return (
    <section id="hotels" className="relative w-full bg-surface-darker min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-0 overflow-hidden font-inter">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-teal-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] rounded-full bg-surface-card blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8 lg:pr-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-center gap-3 mb-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase font-['Cinzel',_serif]">
                Curated Accommodations
              </p>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-playfair">
              Experience <br />
              <span className="italic text-teal-400">unrivaled luxury.</span>
            </h2>
            
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg">
              Elevate your journey with our handpicked selection of premium hotels and exclusive lodges. From the heart of the city to the edge of the wilderness, your perfect stay awaits.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => navigate('/hotels')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-teal-500 px-10 py-4 text-sm font-bold text-surface-darker uppercase tracking-widest transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98]"
              >
                Book a Hotel
              </button>
              
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-teal-400" /> Secure
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarCheck className="text-teal-400" /> Flexible
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Display */}
          <div className="w-full lg:w-1/2 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-150">
            
            {/* Main Image Container */}
            <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[75vh] max-h-[700px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80" 
                alt="Luxury Hotel" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-darker via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating Glass Card - Rating */}
            <div className="absolute top-8 -left-6 sm:-left-12 lg:-left-16 bg-surface-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-in slide-in-from-left-4 duration-700 delay-500">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xl">
                <FaStar />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">5.0</p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Premium Rated</p>
              </div>
            </div>

            {/* Floating Glass Card - Location Info */}
            <div className="absolute bottom-8 -right-4 sm:-right-8 lg:-right-10 bg-surface-card/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl animate-in slide-in-from-right-4 duration-700 delay-700 max-w-[200px]">
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Featured</p>
              <p className="text-white font-playfair text-lg font-bold leading-tight mb-2">Serengeti Safari Lodge</p>
              <p className="text-white/50 text-xs">Uninterrupted views of the great migration.</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
