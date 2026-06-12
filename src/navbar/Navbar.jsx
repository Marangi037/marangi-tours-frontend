import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaHeart, FaSearch, FaTimes, FaStar, FaMapMarkerAlt, FaTrash, FaRegUser, FaUserCog } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { searchAttractions, destinationCountries } from '../destinationData.js';
import { useAuth } from '../context/AuthContext.jsx';
import { searchService } from '../services/api.js';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const sectionIds = ['home', 'destination', 'hotels', 'reviews', 'blog', 'contact'];
  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'destination', label: 'DESTINATIONS' },
    { id: 'hotels', label: 'HOTELS' },
    { id: 'reviews', label: 'REVIEWS' },
    { id: 'blog', label: 'BLOG' },
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
      const isOutsideDesktop = searchContainerRef.current && !searchContainerRef.current.contains(e.target);
      const isOutsideMobile = mobileSearchRef.current ? !mobileSearchRef.current.contains(e.target) : true;

      if (isOutsideDesktop && isOutsideMobile) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (attraction) => {
    // Log the selected destination ID as a search event
    searchService.logSearch(attraction.id).catch(() => { });

    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/attraction/${attraction.id}`);
  };

  // Fetch real-time trending destinations
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { trends } = await searchService.getTrending();

        const all = destinationCountries.flatMap(c => c.attractions.map(a => ({ ...a, countryName: c.name })));
        let trendingIds = trends.map(t => t.query);

        // Provide a curated fallback if the backend hasn't gathered enough data yet
        if (trendingIds.length < 6) {
          const fallback = ['eiffel-tower', 'taj-mahal', 'colosseum', 'santorini-caldera', 'fushimi-inari', 'maasai-mara-safari'];
          trendingIds = [...new Set([...trendingIds, ...fallback])];
        }

        const resolved = trendingIds.map(id => all.find(a => a.id === id)).filter(Boolean).slice(0, 6);
        setTrendingDestinations(resolved);
      } catch (err) {
        console.error("Failed to fetch trending searches", err);
      }
    };

    fetchTrending();
    // Refresh trends every 30 seconds
    const interval = setInterval(fetchTrending, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll Spy
      const viewportTrigger = window.innerHeight * 0.4;
      let newActiveSection = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTrigger) {
            newActiveSection = id;
          } else {
            break;
          }
        }
      }

      setActiveLink(newActiveSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenu || isSearchOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = '';
    };
  }, [isMenu, isSearchOpen, isWishlistOpen]);

  // Close menus and scroll to top on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenu(false);
    setSearchQuery('');
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <header
        className={`absolute top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-lg ${
          isScrolled || location.pathname !== '/'
            ? 'bg-slate-950/90 py-3 sm:py-4 border-b border-white/10 shadow-lg shadow-black/10'
            : 'bg-slate-950/30 py-4 sm:py-6 border-b border-white/5'
        }`}
      >
        <div className='mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12 relative min-h-[40px] sm:min-h-[48px]'>

          {/* Left: Mobile icons & Logo */}
          <div className='flex items-center gap-2 sm:gap-3'>
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

            {/* Mobile Wishlist */}
            <button
              onClick={toggleWishlist}
              className='md:hidden relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
              aria-label='Wishlist'
            >
              <FaHeart className={wishlistItems.length > 0 ? 'text-teal-400' : ''} />
              {wishlistItems.length > 0 && (
                <span className='absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-500 text-white text-[0.65rem] font-semibold'>
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Logo */}
            <div className='flex items-center gap-2 flex-shrink-0 cursor-pointer md:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0' onClick={() => navigate('/')} onMouseEnter={() => window.scrollTo(0, 0)}>
              <img src="/travel-agency.png" alt="Travel Agency Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-md" />
            </div>
          </div>

          {/* Center: Navigation */}
          <nav className='hidden md:flex items-center justify-center gap-6 xl:gap-8 text-xs font-semibold tracking-widest'>
            {navLinks.map((link) => (
              <a
                key={link.id}
                onClick={(e) => handleClick(e, link.id)}
                href={`/#${link.id}`}
                className={`relative transition-colors whitespace-nowrap ${
                  activeLink === link.id && location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {activeLink === link.id && location.pathname === '/' && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-teal-500" />
                )}
              </a>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className='flex items-center gap-2 sm:gap-3 flex-shrink-0'>

            {/* Search */}
            <div ref={searchContainerRef} className='relative'>
              {/* Desktop Search */}
              <div className='hidden md:block'>
                {isSearchOpen ? (
                  <div className='flex items-center gap-2'>
                    <div className='relative'>
                      <input
                        ref={searchInputRef}
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search destinations...'
                        className='w-56 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all'
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
                      <div className='absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-slate-900 border border-white/10 shadow-2xl'>
                        {searchResults.length > 0 ? (
                          searchResults.map((item) => (
                            <Link
                              key={item.id}
                              to={`/attraction/${item.id}`}
                              onClick={() => {
                                searchService.logSearch(item.id).catch(() => { });
                              }}
                              onMouseEnter={() => window.scrollTo(0, 0)}
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
                            </Link>
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
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
                    aria-label='Search'
                  >
                    <FaSearch className='text-sm' />
                  </button>
                )}
              </div>

              {/* Mobile Search Button */}
              <div className='md:hidden'>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
                  aria-label='Search'
                >
                  <FaSearch className='text-sm' />
                </button>
              </div>
            </div>

            {/* Wishlist (Desktop) */}
            <button
              onClick={toggleWishlist}
              className='hidden md:flex relative h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
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
              onMouseEnter={() => window.scrollTo(0, 0)}
              className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
              aria-label='Profile'
            >
              {isAuthenticated ? <FaUserCog className='text-sm text-teal-400' /> : <FaRegUser className='text-sm' />}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer (animated) */}
      <div className='md:hidden'>
        <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenu(false)} />

          <div className={`absolute left-0 top-0 h-full w-full overflow-y-auto flex flex-col transform transition-transform duration-300 ease-in-out ${isMenu ? 'translate-x-0' : '-translate-x-full'}`}
            style={{
              background: 'linear-gradient(180deg, rgba(8, 16, 31, 0.97) 0%, rgba(15, 23, 42, 0.98) 50%, rgba(8, 16, 31, 0.99) 100%)',
              borderRight: '1px solid rgba(45, 212, 191, 0.15)',
              boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(45, 212, 191, 0.05)',
            }}
          >
            {/* Header */}
            <div className='p-5 flex items-center justify-between' style={{ borderBottom: '1px solid rgba(45, 212, 191, 0.12)' }}>
              <div className='flex items-center gap-2 cursor-pointer' onClick={() => { setIsMenu(false); navigate('/'); }} onMouseEnter={() => window.scrollTo(0, 0)}>
                <img src="/travel-agency.png" alt="Travel Agency Logo" className="h-10 w-auto object-contain drop-shadow-md" />
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
                  blog: (
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' />
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
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'
                      }`}>
                      {icons[link.id]}
                    </span>

                    {/* Label */}
                    <span className={`text-sm font-semibold tracking-wider transition-colors duration-200 ${isActive ? 'text-teal-400' : 'text-white/60 group-hover:text-white/90'
                      }`}>
                      {link.label}
                    </span>

                    {/* Hover arrow */}
                    <svg className={`w-4 h-4 ml-auto transition-all duration-200 ${isActive ? 'text-teal-400/60 translate-x-0 opacity-100' : 'text-white/20 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
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
              {!isAuthenticated ? (
                <div className='flex items-center gap-4 w-full'>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenu(false)}
                    onMouseEnter={() => window.scrollTo(0, 0)}
                    className='flex-1 rounded-xl border border-white/20 bg-white/5 py-3.5 text-center text-sm font-bold tracking-widest text-white transition-all hover:bg-white/10 uppercase'
                  >
                    Join Us
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenu(false)}
                    onMouseEnter={() => window.scrollTo(0, 0)}
                    className='flex-1 rounded-xl py-3.5 text-center text-sm font-bold tracking-widest transition-all hover:scale-105 uppercase bg-white text-primary'
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <Link
                  to="/settings"
                  onClick={() => setIsMenu(false)}
                  onMouseEnter={() => window.scrollTo(0, 0)}
                  className='flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold tracking-widest transition-all hover:scale-105 uppercase bg-white text-primary'
                >
                  <FaUserCog /> Profile Settings
                </Link>
              )}

              {/* Social / branding footer */}
              <p className='text-center text-[10px] text-white/40 tracking-widest uppercase mt-8'>
                &copy; 2026 Marangi Tours All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Slide-out Panel */}
      {isWishlistOpen && (
        <div className='fixed inset-0 z-[60]'>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={closeWishlist} />

          {/* Panel */}
          <div className='absolute right-0 top-0 h-full w-full md:max-w-sm bg-slate-900 border-l border-white/10 shadow-2xl overflow-y-auto'>
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
                <div className='text-center py-16 flex flex-col items-center'>
                  <FaHeart className='text-4xl text-slate-700 mb-4' />
                  <p className='text-slate-400 text-sm mb-6'>Your wishlist is empty</p>
                  <a
                    href="/#destination"
                    onClick={(e) => {
                      closeWishlist();
                      if (window.location.pathname !== '/') {
                        e.preventDefault();
                        navigate('/#destination');
                      }
                    }}
                    className='rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold !text-white shadow-lg shadow-teal-500/20 hover:bg-teal-400 hover:scale-105 transition-all inline-block'
                  >
                    Explore Destinations
                  </a>
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

      {/* Mobile Search Full-Page Overlay */}
      {isSearchOpen && (
        <div ref={mobileSearchRef} className='fixed inset-0 z-[60] bg-slate-950 md:hidden flex flex-col'>
          {/* Header */}
          <div className='flex items-center gap-3 p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md'>
            <div className='relative flex-1'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Where to next?'
                className='w-full rounded-full bg-white/10 border border-white/20 py-2.5 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 text-sm'
                autoFocus
              />
            </div>
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className='text-sm font-medium text-slate-300'>
              Cancel
            </button>
          </div>

          {/* Body */}
          <div
            className='flex-1 overflow-y-auto p-4'
            onMouseDown={(e) => e.preventDefault()}
          >
            {searchQuery.length === 0 ? (
              <div>
                <h3 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4'>Most Searched Destinations</h3>
                <div className='grid grid-cols-2 gap-3'>
                  {trendingDestinations.map(dest => (
                    <Link
                      key={dest.id}
                      to={`/attraction/${dest.id}`}
                      onClick={() => {
                        searchService.logSearch(dest.id).catch(() => { });
                      }}
                      onMouseEnter={() => window.scrollTo(0, 0)}
                      className='relative rounded-2xl overflow-hidden h-28 cursor-pointer group block'
                    >
                      <img src={dest.imageUrl} className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' alt={dest.name} />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors' />
                      <div className='absolute bottom-3 left-3 right-3'>
                        <p className='text-white font-bold text-sm truncate leading-tight'>{dest.name}</p>
                        <p className='text-white/70 text-[10px] mt-0.5 flex items-center gap-1'><FaMapMarkerAlt className="text-teal-400" /> {dest.city}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className='space-y-3'>
                {searchResults.map(item => (
                  <Link
                    key={item.id}
                    to={`/attraction/${item.id}`}
                    onClick={() => {
                      searchService.logSearch(item.id).catch(() => { });
                    }}
                    onMouseEnter={() => window.scrollTo(0, 0)}
                    className='flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 p-3 transition-all active:bg-white/10 cursor-pointer block'
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className='h-14 w-14 rounded-lg object-cover flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-white truncate'>{item.name}</p>
                      <div className='flex items-center gap-1 mt-0.5'>
                        <FaMapMarkerAlt className='text-teal-400 text-[9px]' />
                        <span className='text-xs text-slate-400 truncate'>{item.city}, {item.countryName || item.country}</span>
                      </div>
                    </div>
                    <div className='flex-shrink-0 flex flex-col items-end gap-1'>
                      <span className='flex items-center gap-1 text-xs text-white font-semibold bg-white/10 px-2 py-0.5 rounded-full'>
                        <FaStar className='text-amber-400 text-[9px]' /> {item.rating}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full py-20 text-center px-4'>
                <div className='h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-black/20'>
                  <FaSearch className='text-3xl text-slate-500' />
                </div>
                <h3 className='text-xl font-bold text-white mb-2'>No destinations found</h3>
                <p className='text-sm text-slate-400 max-w-[250px] leading-relaxed'>
                  We couldn't find anything matching "{searchQuery}". Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};