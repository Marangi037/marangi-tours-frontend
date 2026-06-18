import React from 'react';
import { FaPlane } from 'react-icons/fa';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[#0B1F3A] overflow-hidden">
      {/* Central container */}
      <div className="relative flex justify-center items-center w-32 h-32">
        
        {/* Subtle glowing pulse behind the logo */}
        <div className="absolute w-20 h-20 bg-[#D4AF37]/20 rounded-full blur-xl animate-pulse"></div>

        {/* The 3D orbit container */}
        <div className="absolute inset-0 flex justify-center items-center" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          
          {/* Orbit Ring */}
          <div className="absolute inset-0" style={{ transform: 'rotateX(75deg) rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/30"></div>
            
            {/* The rotating plane container */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
              {/* The plane icon positioned at the top of the ring */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#D4AF37] text-xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
                style={{ transform: 'rotateX(-75deg) rotateY(15deg)' }}
              >
                <div style={{ animation: 'spin 3s linear infinite reverse' }}>
                  <FaPlane className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Central Logo */}
        <img width="800" height="600" loading="lazy" 
          src="/travel-agency.png" 
          alt="Loading..." 
          className="w-12 h-12 z-10 object-contain drop-shadow-lg" 
        />
        
      </div>
    </div>
  );
};
