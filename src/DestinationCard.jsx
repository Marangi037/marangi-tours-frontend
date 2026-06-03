import React, { useState } from 'react'
import "./destination.css";
import { FaStar, FaHeart } from 'react-icons/fa';
import { useCart } from './context/CartContext.jsx';

export const DestinationCard = ({ id, imageUrl, name, country, rating, price, temperature, bestTime, tags }) => {
  const [hovered, setHovered] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useCart();

  const saved = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (saved) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, imageUrl, price, city: country });
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='w-full min-w-[300px] px-2 md:min-w-2/4 lg:min-w-1/4 max-h-[460px] flex flex-col rounded-[2rem] relative overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-3xl'
    >
      <img className='w-full h-full rounded-[2rem] object-cover' src={imageUrl} alt={name} />
      <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-80'}`} />
      
      {/* Price badge */}
      <div className='absolute top-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm'>
        {price}
      </div>

      {/* Wishlist heart */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
          saved
            ? 'bg-red-500/20 border border-red-500/30 text-red-400'
            : 'bg-black/50 border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10'
        }`}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FaHeart className='text-sm' />
      </button>

      <div className={`absolute bottom-4 left-4 right-4 rounded-[1.5rem] bg-[rgba(8,16,31,0.92)] border border-white/10 p-5 transition-transform duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-95'}`}>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-[var(--color-secondary)]'>{country}</p>
            <h2 className='text-2xl font-semibold text-[var(--color-text)]'>{name}</h2>
          </div>
          <div className='flex items-center gap-1 text-[var(--color-secondary)]'>
            {Array.from({ length: rating }).map((_, index) => (
              <FaStar key={index} className='text-[var(--color-secondary)]' />
            ))}
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--color-muted)]'>
          <span>Temp: {temperature}</span>
          <span>Best: {bestTime}</span>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <span key={tag} className='rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[var(--color-text)] text-xs'>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleWishlistToggle}
          className={`mt-5 w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            saved
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'btn-secondary'
          }`}
        >
          <FaHeart /> {saved ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </div>
  )
}
