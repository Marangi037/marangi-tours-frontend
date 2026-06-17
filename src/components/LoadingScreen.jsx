import React from 'react';
import { FaPlane } from 'react-icons/fa';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[#0B1F3A] overflow-hidden">
      {/* Central container */}
      <div className="relative flex justify-center items-center w-40 h-40">
        
        {/* Subtle glowing pulse behind the logo */}
        <div className="absolute w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-xl animate-pulse"></div>

        {/* The dashed orbit ring representing a flight path */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/30"></div>
        
        {/* The rotating plane container */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          {/* The plane icon positioned at the top of the ring */}
          {/* We rotate the plane 90 degrees so it faces the direction of the spin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-90 text-[#D4AF37] text-2xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
            <FaPlane />
          </div>
        </div>

        {/* Central Logo */}
        <img width="800" height="600" loading="lazy" 
          src="/travel-agency.png" 
          alt="Loading..." 
          className="w-16 h-16 z-10 object-contain drop-shadow-lg" 
        />
        
      </div>
    </div>
  );
};
