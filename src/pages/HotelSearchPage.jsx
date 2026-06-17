import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { hotelService } from '../services/api.js';
import { HotelCard } from '../components/HotelCard.jsx';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';

const FILTERS = ['All', 'Budget', 'Mid-range', 'Luxury', '5 Star', 'Pool', 'Free WiFi', 'Breakfast Included'];

export const HotelSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(initialDestination);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Price Range
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(1500);

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        // Use the exact search input for the DB query
        const res = await hotelService.searchHotels({ 
          city: searchInput, 
          checkInDate: checkIn || new Date(Date.now() + 86400000).toISOString().slice(0, 10), 
          checkOutDate: checkOut || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10) 
        });
        
        const payload = res?.data || res;
        let list = Array.isArray(payload) ? payload : (payload.data || payload.hotels || []);
        
        if (list.length === 0) {
          setError("It looks like our hotel partners are taking a quick siesta. We couldn't find any available rooms in this area right now.");
          setHotels([]);
        } else {
          setHotels(list);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError("Oops! We hit a tiny bump in the road while searching for your perfect stay. Please give it another try in a moment.");
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHotels();
  }, [searchInput, checkIn, checkOut]);

  const filteredHotels = hotels.filter(h => {
    const p = parseFloat(h.pricePerNight || h.price || (h.offers?.[0]?.price?.total) || 0);
    return p >= minPrice && p <= maxPrice;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    const priceA = parseFloat(a.pricePerNight || a.price || (a.offers?.[0]?.price?.total) || 0);
    const priceB = parseFloat(b.pricePerNight || b.price || (b.offers?.[0]?.price?.total) || 0);
    
    switch (sortBy) {
      case 'Price: Low to High': return priceA - priceB;
      case 'Price: High to Low': return priceB - priceA;
      case 'Rating: High to Low': return (b.reviewScore || b.rating || 0) - (a.reviewScore || a.rating || 0);
      default: return 0; // Recommended
    }
  });

  return (
    <div className="min-h-screen bg-surface-darker font-inter">
      
      {/* PAGE HEADER */}
      <div className="relative h-[300px] w-full flex flex-col justify-end p-8 lg:px-16 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img width="800" height="600" loading="lazy" 
            src="/images/photo-1496417263034-38ec4f0b665a.jpg" 
            alt="City Background" 
            className="w-full h-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-darker via-surface-darker/80 to-surface-darker/40" />
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-4">
            <Breadcrumbs crumbs={[
              { label: 'Destinations', link: '/destinations' },
              ...(searchInput ? [{ label: searchInput, link: `/hotels?destination=${searchInput}` }] : []),
              { label: 'Hotels' }
            ]} className="!text-white/50" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-2">
            {searchInput ? `Hotels in ${searchInput}` : 'All Hotels'}
          </h1>
          <p className="text-white/60 text-sm">
            {isLoading ? 'Searching...' : `${filteredHotels.length} hotels available for your dates`}
          </p>
        </div>
      </div>

      {/* SEARCH BAR (Sticky) */}
      <div className="sticky top-0 z-40 w-full bg-surface-darker/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-center md:justify-start">
          
          {/* 1. Destination Search */}
          <div className="relative w-full md:w-96 h-11 shrink-0">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by hotel name or location..."
              className="w-full h-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-teal-400/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
        
        {/* SIDEBAR: PRICE SLIDER, SORT, AND FILTERS */}
        <div className="w-full md:w-64 shrink-0 bg-surface-card rounded-2xl border border-white/8 p-6 sticky top-28 mb-6 md:mb-0">
          <h3 className="text-white font-bold mb-6 font-dmsans">Price Range</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm text-white/80 font-medium">
              <span>${minPrice}</span>
              <span>${maxPrice}+</span>
            </div>
            {/* Simple range slider for demo */}
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-teal-400"
            />
          </div>

          <h3 className="text-white font-bold mb-4 font-dmsans">Sort</h3>
          <div className="mb-8 relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center justify-between w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors"
            >
              <span>{sortBy}</span>
              <FaChevronDown className={`text-xs text-white/40 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-surface-darker border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === option ? 'bg-teal-500/20 text-teal-400' : 'text-white/80 hover:bg-white/5'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-white font-bold mb-4 font-dmsans">Filters</h3>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeFilter === f 
                  ? 'bg-teal-500 border-teal-500 text-surface-darker shadow-md shadow-teal-500/20' 
                  : 'bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT: HOTEL GRID */}
        <div className="flex-1 w-full">
          
          {isLoading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-surface-card border border-white/5 overflow-hidden h-[380px] animate-pulse">
                  <div className="w-full h-48 bg-teal-400/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-1/3 bg-white/10 rounded" />
                    <div className="h-5 w-3/4 bg-white/20 rounded" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                    <div className="h-10 w-full bg-teal-400/10 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedHotels.length > 0 ? (
            // Results Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHotels.map((hotel, i) => (
                <HotelCard 
                  key={hotel._id || hotel.hotelId || i} 
                  hotel={hotel} 
                  isFullyBooked={hotel.isFullyBooked} 
                />
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-red-500/20 rounded-2xl bg-surface-card/50">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <FaSearch className="text-red-400/50 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-playfair">Connection Lost</h2>
              <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full bg-teal-500 text-surface-darker text-sm font-bold transition-all hover:bg-teal-400"
              >
                Try Again
              </button>
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-surface-card/50">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <FaSearch className="text-white/20 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-playfair">No hotels found</h2>
              <p className="text-white/50 text-sm max-w-sm mb-6">
                Try adjusting your dates, price range, or filters to find available stays.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => { setMinPrice(0); setMaxPrice(2000); setActiveFilter('All'); }}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-white hover:bg-white/5 text-sm font-semibold transition-colors"
                >
                  Clear Filters
                </button>
                <button 
                  className="px-6 py-2.5 rounded-full bg-teal-500 text-surface-darker text-sm font-bold transition-all hover:bg-teal-400"
                >
                  Change Destination
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
