import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hotelService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { PhotoGallery } from '../components/PhotoGallery.jsx';
import { NearbyAttractions } from '../components/NearbyAttractions.jsx';
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaSpa, FaDumbbell, FaSnowflake, FaCar, FaChevronDown, FaChevronUp, FaShieldAlt, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';

export const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createBooking } = useBooking();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Booking Card State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [dateError, setDateError] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Accordion state
  const [openRoom, setOpenRoom] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      setIsLoading(true);
      try {
        const res = await hotelService.getHotelById(id);
        const data = res?.data || res;
        if (data && Object.keys(data).length > 0) {
          setHotel(data);
        } else {
          setHotel(mockHotelData(id));
        }
      } catch (err) {
        console.error('Failed to fetch hotel details:', err);
        setHotel(mockHotelData(id));
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const mockHotelData = (hotelId) => ({
    id: hotelId,
    name: 'Serengeti Safari Lodge & Spa',
    city: 'Serengeti',
    country: 'Tanzania',
    address: 'Seronera Area, Serengeti National Park, Tanzania',
    rating: 4.8,
    reviewsCount: 245,
    description: "Immerse yourself in the heart of the wild. Our luxury lodge offers uninterrupted views of the great migration, blending traditional African architecture with world-class amenities. Experience unparalleled comfort while surrounded by the untamed beauty of the Serengeti. Whether you're here for the wildlife, the serenity, or the breathtaking sunsets, every moment is crafted to be unforgettable.",
    price: 450,
    photos: [
      'https://images.unsplash.com/photo-1542314831-c6a4d27ece11?w=1920&q=80',
      '/images/photo-1586861635167-e5223aadc9fe.jpg',
      '/images/photo-1566073771259-6a8506099945.jpg',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c0d139f9?w=800&q=80',
      '/images/photo-1590523277543-a94d2e4eb00b.jpg',
    ],
    rooms: [
      { id: 1, name: 'Savannah Tent', beds: '1 King Bed', sqm: 45, price: 450 },
      { id: 2, name: 'Luxury Suite', beds: '1 King Bed, 1 Sofa Bed', sqm: 65, price: 650 },
      { id: 3, name: 'Family Villa', beds: '2 King Beds, 2 Twins', sqm: 120, price: 1200 },
    ],
    reviews: [
      { id: 1, name: 'Sarah Jenkins', initial: 'S', color: 'bg-teal-500', rating: 5, date: 'Oct 2025', text: 'Absolutely breathtaking! The staff went above and beyond.', verified: true },
      { id: 2, name: 'Michael T.', initial: 'M', color: 'bg-blue-500', rating: 4, date: 'Sep 2025', text: 'Great views of the animals right from the balcony. Food was excellent.', verified: true },
    ]
  });

  if (isLoading || !hotel) {
    return <div className="min-h-screen bg-surface-darker flex items-center justify-center text-teal-400">Loading hotel details...</div>;
  }

  const amenitiesList = [
    { icon: <FaWifi />, label: 'Free High-Speed WiFi' },
    { icon: <FaSwimmingPool />, label: 'Infinity Pool' },
    { icon: <FaParking />, label: 'Free Valet Parking' },
    { icon: <FaCoffee />, label: 'Complimentary Breakfast' },
    { icon: <FaSpa />, label: 'Luxury Spa & Wellness' },
    { icon: <FaDumbbell />, label: 'Fitness Center' },
    { icon: <FaSnowflake />, label: 'Air Conditioning' },
    { icon: <FaCar />, label: 'Airport Transfer' },
  ];

  const priceVal = parseFloat(hotel.pricePerNight || hotel.price || hotel.offers?.[0]?.price?.total || 450);
  const nights = (checkIn && checkOut) ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 3;
  const taxes = Math.floor(priceVal * nights * 0.15);
  const total = (priceVal * nights) + taxes;

  const handleBooking = async (roomName, roomPrice) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { toastMessage: 'Please login to continue your booking.' } });
      return;
    }
    if (!checkIn || !checkOut) {
      setDateError(true);
      return;
    }
    setDateError(false);
    
    const calculatedNights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const calculatedTotal = (roomPrice * calculatedNights) + Math.floor(roomPrice * calculatedNights * 0.15);

    try {
      setIsBooking(true);
      setBookingError('');
      const bookingData = {
        hotel: hotel._id || hotel.id,
        room: roomName,
        checkIn,
        checkOut,
        guests: parseInt(adults) + parseInt(children),
        totalPrice: calculatedTotal
      };
      const res = await createBooking(bookingData);
      const bookingId = res?.booking?._id || res?.booking?.id || res?._id || res?.id;
      if (bookingId) {
        navigate(`/checkout/${bookingId}`);
      } else {
        setBookingError("Booking response didn't contain an ID.");
      }
    } catch (err) {
      console.error(err);
      setBookingError(err?.response?.data?.message || err.message || "Failed to create booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-darker text-white font-inter pt-[100px] lg:pt-[120px] pb-20">
      
      {/* 1. PHOTO GALLERY (Full Width) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 pt-6 pb-10">
        <PhotoGallery 
          photos={
            (hotel.photoUrls && hotel.photoUrls.length > 0) ? hotel.photoUrls :
            (hotel.images && hotel.images.length > 0) ? hotel.images :
            (hotel.photos && hotel.photos.length > 0) ? hotel.photos :
            [hotel.image || 'https://images.unsplash.com/photo-1542314831-c6a4d27ece11?w=1920&q=80']
          } 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* LEFT COLUMN (65%) */}
        <div className="w-full lg:w-[65%]">
          
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs crumbs={[
              { label: 'Destinations', link: '/destinations' },
              { label: hotel.city || 'City', link: `/hotels?destination=${hotel.city}` },
              { label: hotel.name }
            ]} />
          </div>

          {/* Hotel Title & Rating */}
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-white mb-4 leading-tight">
            {hotel.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex text-teal-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(hotel.rating || 4.5) ? '' : 'opacity-30'} />
              ))}
            </div>
            <a href="#reviews" className="text-white/60 text-sm hover:text-teal-400 underline underline-offset-4 decoration-white/20 transition-all">
              {hotel.reviewsCount || 120} reviews
            </a>
          </div>

          <div className="flex items-center gap-2 text-teal-400 mb-8">
            <FaMapMarkerAlt className="text-lg" />
            <span className="text-white/80 text-sm md:text-base">{hotel.address || `${hotel.city}, ${hotel.country}`}</span>
            <button className="ml-2 text-xs font-bold uppercase tracking-widest text-teal-400 border border-teal-400/30 px-3 py-1 rounded-full hover:bg-teal-400/10 transition-colors">
              View on Map
            </button>
          </div>

          <div className="w-full h-px bg-teal-400/20 mb-8" />

          {/* Description */}
          <div className="mb-12">
            <h3 className="text-xl font-bold font-playfair mb-4">About this stay</h3>
            <p className="text-white/70 font-light leading-relaxed font-dmsans">
              {hotel.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="mb-12">
            <h3 className="text-xl font-bold font-playfair mb-6">Popular Amenities</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-teal-400 text-lg">{amenity.icon}</span>
                  <span className="text-white/80 text-sm">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-12" />

          {/* Room Types Accordion */}
          <div className="mb-12">
            <h3 className="text-xl font-bold font-playfair mb-6">Available Rooms</h3>
            <div className="space-y-4">
              {hotel.rooms?.map((room, idx) => (
                <div key={room._id || room.id || idx} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setOpenRoom(openRoom === idx ? -1 : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col items-start text-left">
                      <span className="font-bold text-lg text-white mb-1">{room.name}</span>
                      <span className="text-sm text-slate-400">{room.beds} · {room.sqm} sq m</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end text-right hidden sm:flex">
                        <span className="text-white font-bold text-lg">${room.price}</span>
                        <span className="text-xs text-slate-400">per night</span>
                      </div>
                      {openRoom === idx ? <FaChevronUp className="text-white/50" /> : <FaChevronDown className="text-white/50" />}
                    </div>
                  </button>
                  {openRoom === idx && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-white/5">
                      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mt-4">
                        <p className="text-sm text-white/60 max-w-sm">
                          Spacious and elegantly furnished with authentic local touches. Includes en-suite bathroom with luxury toiletries and a private viewing deck.
                        </p>
                        <button 
                          disabled={isBooking}
                          onClick={() => handleBooking(room.type || room.name, room.price)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 text-surface-darker text-sm font-bold uppercase tracking-widest hover:bg-teal-400 hover:shadow-lg transition-all"
                        >
                          {isBooking ? 'Booking...' : 'Book This Room'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mb-8 pt-8">
            <h3 className="text-xl font-bold font-playfair mb-6">Guest Reviews</h3>
            <div className="flex items-center gap-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
              <div className="text-4xl font-bold text-white">{hotel.rating?.toFixed(1) || '4.8'}</div>
              <div className="flex flex-col">
                <div className="flex text-teal-400 text-sm mb-1">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <span className="text-sm text-white/60">Based on {hotel.reviewsCount || 120} reviews</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.reviews?.map((review) => (
                <div key={review.id} className="p-6 rounded-2xl bg-surface-card border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${review.color}`}>
                        {review.initial}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{review.name}</div>
                        <div className="text-xs text-white/50">{review.date}</div>
                      </div>
                    </div>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-teal-400 font-bold bg-teal-400/10 px-2 py-1 rounded">
                        <FaCheckCircle /> Verified
                      </div>
                    )}
                  </div>
                  <div className="flex text-teal-400 text-[10px] mb-3">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? '' : 'opacity-30'} />)}
                  </div>
                  <p className="text-sm text-white/70 italic leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (35%) - STICKY BOOKING CARD */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-24 w-full bg-surface-accent border border-teal-500/30 rounded-2xl p-6 shadow-xl shadow-teal-900/20">
            
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-bold text-white font-dmsans">${priceVal}</span>
              <span className="text-white/50 mb-1 text-sm">/ night</span>
            </div>

            <div className="grid grid-cols-2 gap-0 border border-white/20 rounded-t-xl overflow-hidden mb-0">
              <div className="p-3 bg-white/5 border-r border-white/20">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">Check-In</label>
                <input 
                  type="date" 
                  className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
                  value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); setDateError(false); }}
                />
              </div>
              <div className="p-3 bg-white/5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">Check-Out</label>
                <input 
                  type="date" 
                  className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
                  value={checkOut}
                  onChange={(e) => { setCheckOut(e.target.value); setDateError(false); }}
                />
              </div>
            </div>
            
            {/* Inline Error Message */}
            {dateError && (
              <div className="bg-red-500/10 border-x border-b border-red-500/20 px-3 py-2">
                <p className="text-red-400 text-[11px] font-bold uppercase tracking-wider text-center">
                  ⚠️ Please select Check-in and Check-out dates
                </p>
              </div>
            )}

            <div className={`p-3 bg-white/5 border border-white/20 border-t-0 rounded-b-xl mb-6 ${dateError ? 'border-t border-white/20' : ''}`}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-1">Guests</label>
              <div className="flex items-center justify-between text-sm text-white">
                <span>{adults} Adults, {children} Children</span>
                <FaChevronDown className="text-white/50 text-xs" />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
              <div className="flex justify-between text-sm text-white/70">
                <span>${priceVal} × {nights} nights</span>
                <span>${priceVal * nights}</span>
              </div>
              <div className="flex justify-between text-sm text-white/70">
                <span>Taxes & fees</span>
                <span>${taxes}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold">Total</span>
              <span className="text-2xl font-bold text-teal-400">${total}</span>
            </div>

            {/* General Booking Error Message */}
            {bookingError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs font-medium text-center">
                  ⚠️ {bookingError}
                </p>
              </div>
            )}

            <button 
              disabled={isBooking}
              onClick={() => handleBooking(hotel.rooms?.[0]?.type || hotel.rooms?.[0]?.name || 'Standard Room', priceVal)}
              className="w-full h-14 bg-teal-500 rounded-xl text-surface-darker font-bold text-sm uppercase tracking-widest hover:bg-teal-400 hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4"
            >
              {isBooking ? 'Booking...' : 'Book Now'}
            </button>

            <button className="w-full h-12 bg-transparent border border-white/20 rounded-xl text-white font-bold text-sm hover:bg-white/5 transition-all mb-6">
              Add to Wishlist
            </button>

            {/* Trust Badges */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center gap-1">
                <FaCalendarCheck className="text-teal-400 text-lg" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider text-center">Instant<br/>Confirm</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaShieldAlt className="text-teal-400 text-lg" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider text-center">Secure<br/>Pay</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaCheckCircle className="text-teal-400 text-lg" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider text-center">Free<br/>Cancel</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* 3. NEARBY ATTRACTIONS */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <NearbyAttractions city={hotel.city || 'this location'} />
      </div>

    </div>
  );
};
