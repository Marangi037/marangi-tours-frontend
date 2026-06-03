import React, { useState, useEffect, useRef } from 'react'
import { FaArrowRight, FaMapMarked, FaUser, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { hotelService } from './services/api.js';

const POPULAR_CITIES = [
  { name: 'Nairobi', code: 'NBO', country: 'Kenya' },
  { name: 'Mombasa', code: 'MBA', country: 'Kenya' },
  { name: 'Paris', code: 'PAR', country: 'France' },
  { name: 'London', code: 'LON', country: 'UK' },
  { name: 'New York', code: 'NYC', country: 'USA' },
  { name: 'Dubai', code: 'DXB', country: 'UAE' },
  { name: 'Tokyo', code: 'TYO', country: 'Japan' },
  { name: 'Singapore', code: 'SIN', country: 'Singapore' },
  { name: 'Rome', code: 'ROM', country: 'Italy' },
  { name: 'Barcelona', code: 'BCN', country: 'Spain' },
  { name: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
  { name: 'Sydney', code: 'SYD', country: 'Australia' },
  { name: 'Cape Town', code: 'CPT', country: 'South Africa' },
  { name: 'Los Angeles', code: 'LAX', country: 'USA' },
  { name: 'Toronto', code: 'YTO', country: 'Canada' },
  { name: 'Hong Kong', code: 'HKG', country: 'Hong Kong' },
  { name: 'Bangkok', code: 'BKK', country: 'Thailand' },
  { name: 'Istanbul', code: 'IST', country: 'Turkey' },
  { name: 'Rio de Janeiro', code: 'RIO', country: 'Brazil' },
  { name: 'Mumbai', code: 'BOM', country: 'India' }
];

export const Accomodation = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [location, setLocation] = useState('NBO');
  const [citySearch, setCitySearch] = useState('Nairobi');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(nextWeek);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cityRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) setShowCityDropdown(false);
      if (guestRef.current && !guestRef.current.contains(event.target)) setShowGuestDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase()) || 
    c.code.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setCitySearch(city.name);
    setLocation(city.code);
    setShowCityDropdown(false);
  };

  const guestSummary = `${adults} Adult${adults > 1 ? 's' : ''}, ${childrenCount} Child${childrenCount !== 1 ? 'ren' : ''}, ${rooms} Room${rooms > 1 ? 's' : ''}`;


  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await hotelService.searchHotels({ cityCode: location, checkInDate: checkIn, checkOutDate: checkOut });
      const payload = res?.data || res;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload.hotels)
            ? payload.hotels
            : [];

      if (!list.length) {
        setError('No hotels found for the selected search. Please try a different location, dates or guest configuration.');
      } else {
        navigate(`/search?location=${encodeURIComponent(location)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${adults}&rooms=${rooms}&children=${childrenCount}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "We're experiencing a rush of travelers! Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (hotel) => {
    const id = hotel._id || hotel.hotelId || hotel.id;
    if (id && hotel._id) {
      navigate(`/hotel/${hotel._id}`);
    } else {
      // no DB id: can't view details
      // optionally navigate to external preview or show modal — keep simple for now
      setError('This hotel is a preview and has no details to view.');
    }
  };

  return (
    <section id='hotels' className='relative min-h-[75vh] w-full lg:flex bg-[url("/hotel1.jpg")] bg-center bg-cover overflow-x-hidden'>
      <div id='bookNow' className='absolute -top-24' aria-hidden='true' />
      <div className='absolute inset-0 bg-black/40 lg:bg-transparent'></div>
      <div className='hidden lg:flex w-1/2 min-h-[75vh] flex-col justify-center items-center gap-[5rem] pr-[11rem] z-10'>
        <div className='flex w-full h-max justify-center items-center gap-[5rem]'>
          <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel.jpg" alt="hotel picture" />
          <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel1.jpg" alt="hotel picture" />
        </div>
        <div className='flex w-full h-max justify-center items-center gap-[5rem]'>
          <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel2.jpg" alt="hotel picture" />
          <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel.jpg" alt="hotel picture" />
        </div>
      </div>
      <div className='w-full min-h-[75vh] flex flex-col justify-center items-center lg:w-1/2 p-6 z-20'>
        <div className='w-full max-w-xl rounded-[2rem] bg-[rgba(8,16,31,0.85)] border border-white/10 p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl'>
          
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-3'>
              <span className='h-px w-8 bg-[var(--color-secondary)]' />
              <p className='text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[var(--color-secondary)] uppercase'>Premium Stays</p>
            </div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug'>
              Discover your perfect <span className='text-slate-400'>getaway.</span>
            </h2>
          </div>

          <form onSubmit={handleSearch} className='flex flex-col gap-5'>
            <div className='grid grid-cols-1 gap-5'>
              <div className='grid grid-cols-2 gap-4'>
                {/* Location */}
                <div className='flex flex-col gap-2' ref={cityRef}>
                  <label className='text-[10px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase'>Location</label>
                  <div className='relative h-[50px] lg:h-[56px]'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]'>
                      <FaMapMarked className='text-lg' />
                    </span>
                    <input 
                      value={citySearch} 
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setShowCityDropdown(true);
                      }} 
                      onClick={() => setShowCityDropdown(true)}
                      id='location' 
                      className='h-full w-full bg-white/5 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 text-white placeholder-white/30 outline-none focus:bg-white/10 focus:border-[var(--color-secondary)] transition-all text-sm' 
                      type='text' 
                      placeholder='Where to?'
                      autoComplete="off"
                    />

                    {/* Autocomplete Dropdown */}
                    {showCityDropdown && (
                      <div className='absolute top-[calc(100%+8px)] left-0 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[250px] overflow-y-auto'>
                        {filteredCities.length > 0 ? (
                          filteredCities.map(city => (
                            <div 
                              key={city.code} 
                              onClick={() => handleCitySelect(city)}
                              className='px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors'
                            >
                              <div>
                                <div className='text-white font-medium'>{city.name}</div>
                                <div className='text-xs text-slate-400'>{city.country}</div>
                              </div>
                              <span className='text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded'>{city.code}</span>
                            </div>
                          ))
                        ) : (
                          <div className='px-4 py-4 text-sm text-slate-400 text-center'>No destinations found.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div className='flex flex-col gap-2' ref={guestRef}>
                  <label className='text-[10px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase'>Guests/Rooms</label>
                  <div className='relative h-[50px] lg:h-[56px]'>
                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]'>
                      <FaUser className='text-lg' />
                    </span>
                    <input 
                      value={guestSummary} 
                      readOnly
                      onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                      id='guests' 
                      className='h-full w-full bg-white/5 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 text-white placeholder-white/30 outline-none cursor-pointer hover:bg-white/10 transition-all text-sm truncate select-none' 
                      type='text' 
                    />

                    {/* Guests Dropdown Popover */}
                    {showGuestDropdown && (
                      <div className='absolute top-[calc(100%+8px)] right-0 md:left-0 md:right-auto w-[280px] bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50 space-y-4'>
                        {/* Adults */}
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='text-white font-medium text-sm'>Adults</div>
                            <div className='text-xs text-slate-400'>Ages 13 or above</div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-30 transition-all' disabled={adults <= 1}><FaMinus className='text-xs' /></button>
                            <span className='text-white w-4 text-center text-sm'>{adults}</span>
                            <button type="button" onClick={() => setAdults(adults + 1)} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all'><FaPlus className='text-xs' /></button>
                          </div>
                        </div>
                        {/* Children */}
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='text-white font-medium text-sm'>Children</div>
                            <div className='text-xs text-slate-400'>Ages 0-12</div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-30 transition-all' disabled={childrenCount <= 0}><FaMinus className='text-xs' /></button>
                            <span className='text-white w-4 text-center text-sm'>{childrenCount}</span>
                            <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all'><FaPlus className='text-xs' /></button>
                          </div>
                        </div>
                        {/* Rooms */}
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='text-white font-medium text-sm'>Rooms</div>
                            <div className='text-xs text-slate-400'>Separate units</div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-30 transition-all' disabled={rooms <= 1}><FaMinus className='text-xs' /></button>
                            <span className='text-white w-4 text-center text-sm'>{rooms}</span>
                            <button type="button" onClick={() => setRooms(rooms + 1)} className='h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all'><FaPlus className='text-xs' /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase'>Check in</label>
                  <input 
                    id='checkin' 
                    value={checkIn} 
                    onChange={(e) => setCheckIn(e.target.value)} 
                    className='h-[50px] lg:h-[56px] w-full bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:bg-white/10 focus:border-[var(--color-secondary)] transition-all [color-scheme:dark]' 
                    type='date' 
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-[10px] sm:text-xs font-semibold tracking-widest text-slate-400 uppercase'>Check out</label>
                  <input 
                    id='checkout' 
                    value={checkOut} 
                    onChange={(e) => setCheckOut(e.target.value)} 
                    className='h-[50px] lg:h-[56px] w-full bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:bg-white/10 focus:border-[var(--color-secondary)] transition-all [color-scheme:dark]' 
                    type='date' 
                  />
                </div>
              </div>
            </div>

            <button 
              type='submit' 
              className='mt-4 w-full h-[54px] lg:h-[60px] rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] text-sm sm:text-base font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95'
            >
              {loading ? 'Searching...' : 'Search stays'} <FaArrowRight className='text-lg' />
            </button>

            {error && (
              <div className='mt-2 w-full text-center text-red-300 bg-red-950/50 border border-red-900/50 px-4 py-3 rounded-xl text-sm backdrop-blur-sm'>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
