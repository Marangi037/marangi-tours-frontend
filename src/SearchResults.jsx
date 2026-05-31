import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hotelService } from './services/api.js';

const parseQuery = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

export const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => parseQuery(location.search), [location.search]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await hotelService.searchHotels({
          cityCode: query.city || query.location || 'NBO',
          checkInDate: query.checkInDate || query.checkIn || '',
          checkOutDate: query.checkOutDate || query.checkOut || '',
          guests: query.guests || query.party || '1',
        });

        const data = response?.data || response;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.hotels)
          ? data.hotels
          : Array.isArray(data.data)
          ? data.data
          : [];

        setHotels(list);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [query]);

  const handleNewSearch = () => {
    navigate('/');
  };

  return (
    <section className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.08),_transparent_20%),linear-gradient(180deg,_#08101f_0%,_#0d203b_45%,_#f4e8d2_100%)] py-16 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-[var(--color-secondary)]'>Search results</p>
            <h1 className='mt-3 text-4xl font-semibold text-[var(--color-text)]'>Hotels matching your dates</h1>
            <p className='mt-3 text-[var(--color-muted)] max-w-2xl leading-8'>
              Showing available hotels for {query.location || query.city || 'your destination'} from {query.checkInDate || query.checkIn || 'check-in'} through {query.checkOutDate || query.checkOut || 'check-out'}.
            </p>
          </div>

          <button onClick={handleNewSearch} className='btn-secondary rounded-full px-6 py-3 text-sm font-semibold'>New search</button>
        </div>

        {loading ? (
          <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-[var(--color-text)] shadow-2xl'>Loading hotels...</div>
        ) : error ? (
          <div className='rounded-[2rem] border border-red-500/20 bg-red-900/20 p-8 text-red-100 shadow-2xl'>{error}</div>
        ) : hotels.length === 0 ? (
          <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-12 text-center text-[var(--color-text)] shadow-2xl'>No hotels found for this search.</div>
        ) : (
          <div className='grid gap-8 lg:grid-cols-2'>
            {hotels.map((hotel) => {
              const hotelId = hotel._id || hotel.hotelId || hotel.id || null;
              const title = hotel.name || hotel.hotel?.name || hotel.hotelName || 'Hotel';
              const description = hotel.description || hotel.hotel?.description || 'Comfortable stay with great amenities.';
              const price = hotel.pricePerNight || hotel.hotel?.pricePerNight || hotel.offerPrice || hotel.price || 'Contact';
              const image = hotel.images?.[0] || hotel.coverImage || hotel.hotel?.images?.[0] || '/default-hotel.jpg';

              return (
                <div key={hotelId || `${title}-${Math.random()}`} className='overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-xl'>
                  <img src={image} alt={title} className='h-64 w-full object-cover' />
                  <div className='p-8'>
                    <h2 className='text-2xl font-semibold text-[var(--color-text)]'>{title}</h2>
                    <p className='mt-3 text-[var(--color-muted)] leading-7'>{description}</p>
                    <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <span className='text-2xl font-bold text-[var(--color-secondary)]'>${price}</span>
                      {hotelId ? (
                        <button onClick={() => navigate(`/hotel/${hotelId}`)} className='btn-primary rounded-full px-6 py-3 text-sm font-semibold'>View details</button>
                      ) : (
                        <span className='rounded-full bg-white/10 px-5 py-3 text-sm text-[var(--color-text)]'>Preview only</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
