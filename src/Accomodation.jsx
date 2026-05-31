import React, { useState } from 'react'
import { FaArrowRight, FaMapMarked, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { hotelService } from './services/api.js';

export const Accomodation = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [location, setLocation] = useState('NBO');
  const [guests, setGuests] = useState('1');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(nextWeek);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        navigate(`/search?location=${encodeURIComponent(location)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotels.');
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
    <section id='accommodation' className='relative min-h-screen max-w-screen min-w-screen lg:flex bg-[url("/hotel1.jpg")] bg-center bg-cover overflow-x-hidden'>
      <div id='bookNow' className='absolute -top-24' aria-hidden='true' />
      <div className='absolute inset-0 bg-black/40 lg:bg-transparent'></div>
      <div className='hidden lg:flex w-1/2 min-h-screens flex-col justify-center items-center gap-[5rem] pr-[11rem] z-10'>
          <div className='flex w-full h-max justify-center items-center gap-[5rem]'>
            <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel.jpg" alt="hotel picture" />
            <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel1.jpg" alt="hotel picture" />
          </div>
          <div className='flex w-full h-max justify-center items-center gap-[5rem]'>
            <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel2.jpg" alt="hotel picture" />
            <img className='min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] rounded-3xl object-cover shadow-2xl' src="/hotel.jpg" alt="hotel picture" />
          </div>
      </div>
      <div className='w-full min-h-screen flex flex-col justify-center items-center lg:w-1/2 p-6 z-20'>
        <div className='hero-panel rounded-[2rem] border border-white/10 p-10 shadow-2xl backdrop-blur-xl max-w-2xl'>
          <h1 className='lg:text-3xl text-xl font-semibold text-[var(--color-text)] px-6 py-6 tracking-wide leading-relaxed'>We offer an exclusive selection of hotel destinations designed to make your travel effortless, stylish, and unforgettable.</h1>

          <form onSubmit={handleSearch} className='w-full flex flex-col text-[var(--color-text)] gap-4 justify-center items-center py-6'>
            <div className='grid grid-cols-1 gap-4 w-full'>
              <div className='grid grid-cols-1 gap-2'>
                <label className='text-sm text-[var(--color-accent)]'>Location</label>
                <div className='h-[48px] w-full relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]'><FaMapMarked className='text-base lg:text-xl' /></span>
                  <input value={location} onChange={(e) => setLocation(e.target.value.toUpperCase())} id='location' className='input-glow h-[48px] w-full pl-12 rounded-2xl' type='text' />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-2'>
                <label className='text-sm text-[var(--color-accent)]'>Guests and rooms</label>
                <div className='h-[48px] w-full relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]'><FaUser className='text-base lg:text-xl' /></span>
                  <input value={guests} onChange={(e) => setGuests(e.target.value)} id='guests' className='input-glow h-[48px] w-full pl-12 rounded-2xl' type='text' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label className='text-sm text-[var(--color-accent)]'>Check in</label>
                  <input id='checkin' value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className='input-glow h-[48px] rounded-2xl px-4' type='date' />
                </div>
                <div className='grid gap-2'>
                  <label className='text-sm text-[var(--color-accent)]'>Check out</label>
                  <input id='checkout' value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className='input-glow h-[48px] rounded-2xl px-4' type='date' />
                </div>
              </div>
            </div>

            <button type='submit' className='btn-primary w-full max-w-[220px] h-[52px] text-base uppercase tracking-wider flex items-center justify-center gap-2'>
              {loading ? 'Searching...' : 'Search now'} <FaArrowRight className='text-lg' />
            </button>

            {error && (
              <div className='mt-4 w-full text-center text-red-200 bg-red-900/20 px-4 py-3 rounded-2xl'>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
