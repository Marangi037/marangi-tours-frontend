import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { destinationCountries } from '../destinationData.js';
import { useNavigate } from 'react-router-dom';

// Flatten destination data
const getAllDestinations = () => {
  return destinationCountries.flatMap(country => 
    country.attractions.map(attr => ({
      ...attr,
      countryName: country.name,
      countryFlag: country.flag,
      searchString: `${attr.name} ${attr.city} ${country.name}`.toLowerCase()
    }))
  );
};

const allDestinations = getAllDestinations();

export const PredictiveDestinationSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      setIsOpen(true);
      // Simulate API delay for loading state
      const timer = setTimeout(() => {
        const filtered = allDestinations.filter(d => 
          d.searchString.includes(query.toLowerCase())
        ).slice(0, 6);
        setResults(filtered);
        setIsLoading(false);
        setFocusedIndex(-1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[focusedIndex]);
    }
  };

  const handleSelect = (destination) => {
    setQuery(destination.name);
    setIsOpen(false);
    navigate(`/attraction/${destination.id}`);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-50 font-inter" ref={wrapperRef}>
      {/* Search Input */}
      <div className="relative flex items-center w-full h-[60px] rounded-full bg-white/5 backdrop-blur-md border border-white/10 border-l-[3px] border-l-teal-400 overflow-hidden shadow-lg transition-all focus-within:bg-white/10 focus-within:border-white/20 focus-within:border-l-teal-400">
        <FaSearch className="absolute left-6 text-white/50 text-lg" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search a destination — Kenya, Zanzibar, Cape Town..."
          className="w-full h-full bg-transparent pl-14 pr-12 text-[15px] text-white/80 placeholder-white/40 outline-none"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-5 text-white/40 hover:text-white/80 transition-colors p-1"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl bg-surface-card border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {isLoading ? (
            <div className="p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 mb-1 rounded-xl animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-teal-400/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-white/10 rounded" />
                    <div className="h-3 w-1/4 bg-teal-400/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((destination, index) => (
                <div 
                  key={destination.id}
                  onClick={() => handleSelect(destination)}
                  className={`group flex items-center justify-between px-4 py-3 mx-2 rounded-xl cursor-pointer transition-colors ${
                    index === focusedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
                      <img 
                        src={destination.imageUrl || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=100&q=80'} 
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{destination.name}</span>
                      <span className="text-[11px] font-medium text-teal-400/80 uppercase tracking-wide">
                        {destination.countryFlag} {destination.city}, {destination.countryName}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Book this destination →
                  </span>
                </div>
              ))}
              <div className="border-t border-white/5 mt-2 pt-2 px-4 pb-2">
                <button 
                  onClick={() => navigate('/destinations')}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors w-full text-left"
                >
                  See all destinations matching "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FaSearch className="text-white/20 text-2xl" />
              </div>
              <p className="text-white font-medium mb-1">No destinations found.</p>
              <p className="text-sm text-slate-400">Try Nairobi, Zanzibar, or Cape Town.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
