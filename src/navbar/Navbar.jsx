import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaSearch, FaTimes, FaStar, FaMapMarkerAlt, FaTrash, FaRegUser, FaUserCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { searchAttractions } from '../destinationData.js';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('home');
  const [isMenu, setIsMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Wishlist
  const { wishlistItems, isWishlistOpen, toggleWishlist, closeWishlist, removeFromWishlist } = useCart();
  
  // Auth
  const { isAuthenticated } = useAuth();

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const sectionIds = ['home', 'destination', 'hotels', 'reviews', 'contact'];
  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'destination', label: 'DESTINATIONS' },
    { id: 'hotels', label: 'HOTELS' },
    { id: 'reviews', label: 'REVIEWS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleClick = (e, link) => {
    if (window.location.pathname !== '/') {
      e.preventDefault();
      navigate(`/#${link}`);
    }
    setActiveLink(link);
    setIsMenu(false);
  };

  // Search logic
  useEffect(() => {
    const results = searchAttractions(searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (attraction) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/attraction/${attraction.id}`);
  };

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollPosition = window.scrollY + 140;
      const visibleSection = sectionIds
        .map((id) => {
          const section = document.getElementById(id);
          return section ? { id, top: section.offsetTop, bottom: section.offsetTop + section.offsetHeight } : null;
        })
        .filter(Boolean)
        .find((section) => scrollPosition >= section.top && scrollPosition < section.bottom);
      if (visibleSection) setActiveLink(visibleSection.id);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenu ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenu]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-lg ${
          isScrolled
            ? 'bg-slate-950/70 py-3 sm:py-4 border-b border-white/10 shadow-lg shadow-black/10'
            : 'bg-slate-950/30 py-4 sm:py-6 border-b border-white/5'
        }`}
      >
        <div className='mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12'>

          {/* Logo */}
          <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0 cursor-pointer' onClick={() => navigate('/')}>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-teal-900">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M17.5 19c2.48 0 4.5-2.02 4.5-4.5 0-2.3-1.74-4.2-3.95-4.46C17.42 6.55 14.93 4 12 4c-2.4 0-4.48 1.58-5.26 3.79C3.96 8.1 1.5 10.42 1.5 13.5 1.5 16.53 3.97 19 7 19h10.5z"/></svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white">YOUR LOGO</span>
          </div>

          {/* Center: Navigation */}
          <nav className='hidden md:flex items-center justify-center gap-6 xl:gap-8 text-xs font-semibold tracking-widest'>
            {navLinks.map((link) => (
              <a
                key={link.id}
                onClick={(e) => handleClick(e, link.id)}
                href={`/#${link.id}`}
                className={`relative transition-colors whitespace-nowrap ${
                  activeLink === link.id ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {activeLink === link.id && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-teal-500" />
                )}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>

            {/* Search */}
            <div ref={searchContainerRef} className='relative'>
              {isSearchOpen ? (
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <input
                      ref={searchInputRef}
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Search destinations...'
                      className='w-40 sm:w-56 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all'
                    />
                    <button
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors'
                    >
                      <FaTimes className='text-xs' />
                    </button>
                  </div>

                  {/* Search results dropdown */}
                  {searchQuery.length >= 2 && (
                    <div className='absolute top-full right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-xl bg-slate-900 border border-white/10 shadow-2xl'>
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSearchSelect(item)}
                            className='flex w-full items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left'
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className='h-12 w-12 rounded-lg object-cover flex-shrink-0'
                            />
                            <div className='min-w-0'>
                              <p className='text-sm font-semibold text-white truncate'>{item.name}</p>
                              <div className='flex items-center gap-1 mt-0.5'>
                                <FaMapMarkerAlt className='text-teal-400 text-[10px]' />
                                <span className='text-xs text-slate-400 truncate'>{item.city}, {item.country}</span>
                              </div>
                              <div className='flex items-center gap-1 mt-0.5'>
                                <FaStar className='text-amber-400 text-[10px]' />
                                <span className='text-xs text-slate-400'>{item.rating}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className='p-4 text-center text-sm text-slate-500'>
                          No destinations found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
                  aria-label='Search'
                >
                  <FaSearch className='text-sm' />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={toggleWishlist}
              className='relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
              aria-label='Wishlist'
            >
              <FaHeart className={wishlistItems.length > 0 ? 'text-teal-400' : ''} />
              {wishlistItems.length > 0 && (
                <span className='absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-500 text-white text-[0.65rem] font-semibold'>
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <Link
              to={isAuthenticated ? '/settings' : '/login'}
              className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
              aria-label='Profile'
            >
              {isAuthenticated ? <FaUserCog className='text-sm text-teal-400' /> : <FaRegUser className='text-sm' />}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenu(!isMenu)}
              className='md:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white'
              aria-label='Menu'
            >
              {isMenu ? <FaTimes /> : (
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile drawer (animated) */}
        <div className='md:hidden'>
          <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenu(false)} />

            <div className={`absolute left-0 top-0 h-full w-4/5 max-w-sm overflow-y-auto transform transition-transform duration-300 ease-in-out ${isMenu ? 'translate-x-0' : '-translate-x-full'}`}
              style={{
                background: 'linear-gradient(180deg, rgba(8, 16, 31, 0.97) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(8, 16, 31, 0.99) 100%)',
                borderRight: '1px solid rgba(45, 212, 191, 0.15)',
                boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(45, 212, 191, 0.05)',
              }}
            >
              {/* Header */}
              <div className='p-5 flex items-center justify-between' style={{ borderBottom: '1px solid rgba(45, 212, 191, 0.12)' }}>
                <div className='flex items-center gap-3 cursor-pointer' onClick={() => { setIsMenu(false); navigate('/'); }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/20">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.5 19c2.48 0 4.5-2.02 4.5-4.5 0-2.3-1.74-4.2-3.95-4.46C17.42 6.55 14.93 4 12 4c-2.4 0-4.48 1.58-5.26 3.79C3.96 8.1 1.5 10.42 1.5 13.5 1.5 16.53 3.97 19 7 19h10.5z"/></svg>
                  </div>
                  <span className='text-sm font-semibold uppercase tracking-widest text-white'>YOUR LOGO</span>
                </div>
                <button onClick={() => setIsMenu(false)} className='flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all'>
                  <FaTimes className='text-sm' />
                </button>
              </div>

              {/* Decorative accent line */}
              <div className='mx-5 h-px' style={{ background: 'linear-gradient(90deg, rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.05) 80%)' }} />

              {/* Navigation Links */}
              <nav className='flex flex-col gap-1 p-4 mt-2'>
                {navLinks.map((link, idx) => {
                  const icons = {
                    home: (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' />
                      </svg>
                    ),
                    destination: (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
                      </svg>
                    ),
                    hotels: (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21' />
                      </svg>
                    ),
                    reviews: (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' />
                      </svg>
                    ),
                    contact: (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
                      </svg>
                    ),
                  };
                  const isActive = activeLink === link.id;
                  return (
                    <a
                      key={link.id}
                      onClick={(e) => handleClick(e, link.id)}
                      href={`/#${link.id}`}
                      className='group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200'
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(45, 212, 191, 0.05))'
                          : 'transparent',
                        border: isActive ? '1px solid rgba(45, 212, 191, 0.2)' : '1px solid transparent',
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className='absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-teal-400' />
                      )}

                      {/* Icon */}
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'
                      }`}>
                        {icons[link.id]}
                      </span>

                      {/* Label */}
                      <span className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${
                        isActive ? 'text-teal-400' : 'text-white/60 group-hover:text-white/90'
                      }`}>
                        {link.label}
                      </span>

                      {/* Hover arrow */}
                      <svg className={`w-4 h-4 ml-auto transition-all duration-200 ${
                        isActive ? 'text-teal-400/60 translate-x-0 opacity-100' : 'text-white/20 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                      </svg>
                    </a>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className='mx-5 h-px my-2' style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 80%)' }} />

              {/* Bottom CTA section */}
              <div className='p-5 mt-auto'>
                <a
                  href='#destination'
                  onClick={() => setIsMenu(false)}
                  className='flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-sm font-semibold tracking-wider text-white transition-all duration-200 hover:shadow-lg'
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.25)',
                  }}
                >
                  Explore Destinations
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                  </svg>
                </a>

                {/* Social / branding footer */}
                <p className='text-center text-[10px] text-white/20 tracking-widest uppercase mt-6'>
                  Discover Africa & Beyond
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Wishlist Slide-out Panel */}
      {isWishlistOpen && (
        <div className='fixed inset-0 z-[60]'>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={closeWishlist} />

          {/* Panel */}
          <div className='absolute right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-white/10 shadow-2xl overflow-y-auto'>
            {/* Header */}
            <div className='sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-5 flex items-center justify-between z-10'>
              <div className='flex items-center gap-2'>
                <FaHeart className='text-red-400' />
                <h3 className='text-lg font-bold text-white'>Wishlist</h3>
                <span className='rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-0.5'>
                  {wishlistItems.length}
                </span>
              </div>
              <button onClick={closeWishlist} className='text-slate-400 hover:text-white transition-colors'>
                <FaTimes className='text-lg' />
              </button>
            </div>

            {/* Items */}
            <div className='p-4'>
              {wishlistItems.length === 0 ? (
                <div className='text-center py-16'>
                  <FaHeart className='text-4xl text-slate-700 mx-auto mb-4' />
                  <p className='text-slate-400 text-sm'>Your wishlist is empty</p>
                  <p className='text-slate-500 text-xs mt-1'>Explore destinations and save your favourites</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 p-3 transition-all hover:bg-white/8'
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className='h-14 w-14 rounded-lg object-cover flex-shrink-0 cursor-pointer'
                        onClick={() => { closeWishlist(); navigate(`/attraction/${item.id}`); }}
                      />
                      <div className='flex-1 min-w-0'>
                        <p
                          className='text-sm font-semibold text-white truncate cursor-pointer hover:text-teal-400 transition-colors'
                          onClick={() => { closeWishlist(); navigate(`/attraction/${item.id}`); }}
                        >
                          {item.name}
                        </p>
                        {item.city && (
                          <p className='text-xs text-slate-400 mt-0.5 flex items-center gap-1'>
                            <FaMapMarkerAlt className='text-teal-500 text-[9px]' /> {item.city}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className='flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors p-1'
                        aria-label={`Remove ${item.name}`}
                      >
                        <FaTrash className='text-sm' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};