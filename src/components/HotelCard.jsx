import React from 'react';
import { FaHeart, FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaCoffee } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const HotelCard = ({ hotel, isFullyBooked = false }) => {
  const navigate = useNavigate();
  
  // Database data mapping
  const image = hotel.photoUrls?.[0] || hotel.images?.[0] || hotel.image || '/images/photo-1566073771259-6a8506099945.jpg';
  const rating = hotel.reviewScore || hotel.stars || hotel.rating || 4.5;
  const reviewsCount = hotel.reviewCount || hotel.reviewsCount || Math.floor(Math.random() * 200) + 50;
  const price = hotel.pricePerNight || hotel.price || (hotel.offers?.[0]?.price?.total) || '150';
  const badge = hotel.badge || (rating >= 4.8 ? 'TOP RATED' : 'GREAT VALUE');
  
  // Amadeus returns amenities, we map them if they exist
  const amenities = hotel.amenities || ['Free WiFi', 'Pool', 'Breakfast'];

  const getAmenityIcon = (name) => {
    const lName = name.toLowerCase();
    if (lName.includes('wifi')) return <FaWifi />;
    if (lName.includes('pool')) return <FaSwimmingPool />;
    if (lName.includes('breakfast') || lName.includes('coffee')) return <FaCoffee />;
    return null;
  };

  return (
    <div className={`relative flex flex-col rounded-2xl bg-surface-card border border-white/8 transition-all duration-300 font-inter ${
      isFullyBooked 
      ? 'opacity-90' 
      : 'hover:border-teal-400/40 hover:shadow-lg hover:shadow-teal-900/20 hover:-translate-y-1'
    }`}>
      
      {/* FULLY BOOKED OVERLAY */}
      {isFullyBooked && (
        <div className="absolute inset-0 z-20 bg-black/60 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="bg-red-900/80 text-red-300 border border-red-700/50 font-bold uppercase text-xs tracking-widest px-4 py-1.5 rounded-full">
            FULLY BOOKED
          </div>
        </div>
      )}

      {/* Image Area */}
      <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-slate-800 shrink-0">
        <img width="800" height="600" loading="lazy" 
          src={image} 
          alt={hotel.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isFullyBooked ? 'grayscale brightness-50' : ''}`}
        />
        
        {/* Top-left Badge */}
        {!isFullyBooked && badge && (
          <div className="absolute top-3 left-3 bg-teal-400 text-surface-darker text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded font-['Cinzel',_serif]">
            {badge}
          </div>
        )}

        {/* Top-right Wishlist */}
        <button aria-label="Icon button" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-darker/40 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-surface-darker/60 transition-colors z-10"><FaHeart className="text-sm" /></button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-teal-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(rating) ? '' : 'opacity-30'} />
            ))}
          </div>
          <span className="text-white/50 text-xs ml-1">({reviewsCount} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="font-dmsans font-semibold text-white text-base leading-tight mb-1 line-clamp-1">
          {hotel.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
          <FaMapMarkerAlt className="text-teal-400 text-xs shrink-0" />
          <span className="truncate">{hotel.city || 'City Center'}, {hotel.country || ''}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-teal-400/20 bg-teal-400/5 text-white/70 text-[10px] font-medium whitespace-nowrap">
              <span className="text-teal-400">{getAmenityIcon(amenity)}</span>
              {amenity}
            </div>
          ))}
          {amenities.length > 3 && (
            <div className="px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 text-[10px] font-medium">
              +{amenities.length - 3}
            </div>
          )}
        </div>

        {/* Footer (Price & Button) */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-end gap-1">
            <span className="text-white/50 text-sm mb-0.5">from</span>
            <span className="font-dmsans font-bold text-white text-xl">${price}</span>
            <span className="text-white/50 text-sm mb-0.5">/night</span>
          </div>

          <button 
            disabled={isFullyBooked}
            onClick={() => navigate(`/hotel/${hotel._id || hotel.id || 'demo'}`)}
            className={`w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              isFullyBooked 
              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
              : 'bg-teal-500 text-surface-darker hover:brightness-110 hover:scale-[1.01]'
            }`}
          >
            {isFullyBooked ? 'Fully Booked' : 'Book Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
