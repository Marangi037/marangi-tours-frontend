import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const PhotoGallery = ({ photos = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no photos provided
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-surface-card flex items-center justify-center border border-white/10">
        <span className="text-white/40">No photos available</span>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // If only 1 photo
  if (photos.length === 1) {
    return (
      <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden group">
        <img 
          src={photos[0]} 
          alt="Hotel" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <p className="text-white/80 font-medium">More photos coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Grid Layout (Hidden on Mobile) */}
      <div className="hidden md:flex gap-4 h-[500px] w-full">
        {/* Main Image (60%) */}
        <div 
          className="w-[60%] h-full rounded-2xl overflow-hidden cursor-pointer relative group"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={photos[0]} 
            alt="Main Hotel" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnails Grid (40%) */}
        <div className="w-[40%] h-full grid grid-cols-2 grid-rows-2 gap-4 relative">
          {photos.slice(1, 5).map((photo, idx) => (
            <div 
              key={idx} 
              className="rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => openLightbox(idx + 1)}
            >
              <img 
                src={photo} 
                alt={`Hotel ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}

          {/* View All Button */}
          {photos.length > 5 && (
            <button 
              onClick={() => openLightbox(0)}
              className="absolute bottom-4 right-4 bg-surface-darker/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium text-sm hover:bg-surface-darker transition-colors shadow-lg"
            >
              View all {photos.length} photos
            </button>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Scroll Strip (Hidden on Desktop) */}
      <div className="flex md:hidden overflow-x-auto gap-3 snap-x snap-mandatory no-scrollbar w-full h-[300px]">
        {photos.map((photo, idx) => (
          <div 
            key={idx} 
            className="shrink-0 w-[85%] h-full snap-center rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => openLightbox(idx)}
          >
            <img src={photo} alt={`Hotel ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors z-50"
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="absolute top-8 text-white/50 text-sm font-medium tracking-widest font-inter">
            {currentIndex + 1} / {photos.length}
          </div>

          <button 
            onClick={prevPhoto}
            className="absolute left-4 md:left-12 w-14 h-14 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors z-50"
          >
            <FaChevronLeft className="text-2xl mr-1" />
          </button>

          <img 
            src={photos[currentIndex]} 
            alt="Fullscreen" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" 
          />

          <button 
            onClick={nextPhoto}
            className="absolute right-4 md:right-12 w-14 h-14 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors z-50"
          >
            <FaChevronRight className="text-2xl ml-1" />
          </button>
        </div>
      )}
    </>
  );
};
