import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService } from './services/api';
import { useAuth } from './context/AuthContext';
import { useBooking } from './context/BookingContext';
import { FaStar, FaMapMarkerAlt, FaHeart, FaCheck } from 'react-icons/fa';

const defaultRooms = [
  {
    id: 'luxury-suite',
    name: 'Luxury Suite',
    guests: 4,
    price: 420,
    amenities: ['King bed', 'Ocean view', 'Private balcony', 'Ultra-fast WiFi'],
    description: 'Spacious private suite with premium finishes and expansive views.',
  },
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    guests: 2,
    price: 280,
    amenities: ['Queen bed', 'Room service', 'Smart TV', 'Breakfast included'],
    description: 'Comfortable room with elegant touches and restful ambiance.',
  },
  {
    id: 'family-flat',
    name: 'Family Flat',
    guests: 6,
    price: 520,
    amenities: ['Two bedrooms', 'Living area', 'Kitchenette', 'Kids play kit'],
    description: 'Perfect for families, with plenty of room and clever comforts.',
  },
];

export const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createBooking } = useBooking();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(defaultRooms[0].id);
  const [activeAccordion, setActiveAccordion] = useState(defaultRooms[0].id);
  const [reviewPage, setReviewPage] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5 });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await hotelService.getHotelById(id);
        const payload = response?.hotel || response;
        setHotel(payload);
        setReviews(payload.reviews || []);
        if (payload.roomTypes?.length) {
          setSelectedRoomId(payload.roomTypes[0].id);
          setActiveAccordion(payload.roomTypes[0].id);
        }
      } catch (err) {
        setError("We're experiencing a rush of travelers! Please try again in a moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const galleryImages = hotel?.images?.length
    ? hotel.images
    : ['/hotel1.jpg', '/hotel2.jpg', '/hotel3.jpg', '/hotel4.jpg'];

  const roomTypes = hotel?.roomTypes?.length ? hotel.roomTypes : defaultRooms;
  const selectedRoom = useMemo(
    () => roomTypes.find((room) => room.id === selectedRoomId) || roomTypes[0],
    [roomTypes, selectedRoomId]
  );

  const nightCount = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diff = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [checkInDate, checkOutDate]);

  const priceTotal = selectedRoom.price * numberOfRooms * nightCount;

  const ratingStats = useMemo(
    () => [5, 4, 3, 2, 1].map((value) => reviews.filter((review) => review.rating === value).length),
    [reviews]
  );

  const pagedReviews = useMemo(() => {
    const pageSize = 3;
    return reviews.slice(reviewPage * pageSize, reviewPage * pageSize + pageSize);
  }, [reviews, reviewPage]);

  const hotelAddress = hotel?.location?.address || hotel?.name || 'Prime destination';
  const mapQuery = encodeURIComponent(hotelAddress);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await createBooking({
        hotel: id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        numberOfRooms,
        firstName: user?.firstName || 'Guest',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
      });
      navigate(`/checkout/${response.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    if (!newReview.title || !newReview.comment) return;
    const nextReview = {
      _id: `${Date.now()}`,
      title: newReview.title,
      comment: newReview.comment,
      rating: Number(newReview.rating),
      user: { firstName: user?.firstName || 'Guest', lastName: user?.lastName || '' },
      createdAt: new Date().toISOString(),
    };
    setReviews([nextReview, ...reviews]);
    setShowReviewModal(false);
    setNewReview({ title: '', comment: '', rating: 5 });
  };

  if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;
  if (!hotel) return <div className="h-screen flex justify-center items-center">Hotel not found</div>;

  return (
    <div className="hotelPage py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="hotelHeaderSticky">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3 items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-secondary)] bg-[rgba(212,175,55,0.12)] px-4 py-2 text-sm text-[var(--color-secondary)]">
                  <FaMapMarkerAlt /> {hotel.location?.city || hotelAddress}
                </span>
              </div>
              <h1 className="hotelTitle">{hotel.name}</h1>
              <div className="flex flex-wrap gap-3 items-center text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.round(hotel.rating || 4) }).map((_, index) => (
                    <FaStar key={index} className="text-[var(--color-secondary)] animate-pulse" />
                  ))}
                </div>
                <span>{hotel.reviewCount || reviews.length} reviews</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="text-right">
                <p className="text-sm text-[var(--color-muted)]">From</p>
                <p className="text-3xl font-bold text-[var(--color-secondary)]">${hotel.pricePerNight}</p>
              </div>
              <button onClick={handleBooking} className="rippleButton flex items-center justify-center gap-2">
                <FaHeart /> Book Now
              </button>
            </div>
          </div>
        </div>

        <section className="hotelHeroGrid">
          <div className="hotelGallery">
            <div className="galleryMain">
              <img src={galleryImages[selectedImage]} alt={`Slide ${selectedImage + 1}`} />
              <button onClick={() => setLightboxOpen(true)} className="wishlistFloat text-[var(--color-text)]">
                <FaHeart /> Save to wishlist
              </button>
              <div className="galleryNav">
                <button onClick={() => setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}>
                  Prev
                </button>
                <button onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}>
                  Next
                </button>
              </div>
            </div>

            <div className="galleryThumbnails">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`galleryThumbItem ${selectedImage === index ? 'active' : ''}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <aside className="hotelSummaryCard sticky top-28 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--color-secondary)]">
                <FaMapMarkerAlt />
                <span>{hotel.location?.city || 'Prime location'}</span>
              </div>
              <p className="text-[var(--color-text)] leading-relaxed">{hotel.description || 'An elegant hotel experience with every premium service included.'}</p>
            </div>

            <div className="amenitiesGrid space-y-4">
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(hotel.amenities || ['Pool', 'Spa', 'Gym', 'Restaurant']).slice(0, 4).map((amenity) => (
                  <div key={amenity} className="amenityItem">
                    <span className="iconBadge"><FaCheck /></span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mapFrame">
              <iframe
                title='Hotel location map'
                src={mapUrl}
                width='100%'
                height='100%'
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </aside>
        </section>

        <section className="space-y-10">
          <div className="hotelSummaryCard p-8">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Room Options</h2>
            <div className="space-y-5">
              {roomTypes.map((room) => (
                <div key={room.id} className={`roomCard ${selectedRoomId === room.id ? 'active' : ''}`}>
                  <div className="roomCardHeader">
                    <div>
                      <h3 className="text-2xl font-semibold text-[var(--color-text)]">{room.name}</h3>
                      <p className="text-[var(--color-muted)] mt-2">{room.guests} guests · ${room.price} per night</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setActiveAccordion(activeAccordion === room.id ? '' : room.id);
                      }}
                      className="rippleButton"
                    >
                      {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                    </button>
                  </div>
                  <div className="roomAccordion">
                    <div className="flex flex-wrap gap-3">
                      {room.amenities.slice(0, 4).map((feature) => (
                        <span key={feature} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm text-[var(--color-text)]">
                          <FaCheck className="text-[var(--color-secondary)]" />
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-[var(--color-muted)]">{room.description}</p>
                    {activeAccordion === room.id && (
                      <div className="mt-4 text-[var(--color-text)]">
                        <p>Rolled out with extra comforts for every stay.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hotelSummaryCard p-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Availability</h2>
              <div className="calendarHeader">
                <span className="text-[var(--color-text)]">Choose your travel window</span>
                <span className="text-[var(--color-muted)]">{nightCount} night stay</span>
              </div>
              <div className="calendarDays">
                {Array.from({ length: 14 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  const label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                  const active = index < 4;
                  return (
                    <div key={index} className={`calendarDay ${active ? 'active' : ''}`}>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="priceBreakdown">
              <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-4">Price calculator</h3>
              <div className="space-y-4">
                <div className="priceRow">
                  <span>Room type</span>
                  <span>{selectedRoom.name}</span>
                </div>
                <div className="priceRow">
                  <span>Guests</span>
                  <span>{numberOfGuests}</span>
                </div>
                <div className="priceRow">
                  <span>Rooms</span>
                  <span>{numberOfRooms}</span>
                </div>
                <div className="priceRow">
                  <span>Nights</span>
                  <span>{nightCount}</span>
                </div>
                <div className="priceTotal text-lg">
                  ${priceTotal} total
                </div>
              </div>
            </div>
          </div>

          <div className="hotelSummaryCard p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[var(--color-primary)]">Traveler Reviews</h2>
                <p className="text-[var(--color-muted)]">Insightful feedback from recent guests.</p>
              </div>
              <button onClick={() => setShowReviewModal(true)} className="rippleButton">
                Write a Review
              </button>
            </div>

            <div className="reviewChart p-6 mb-6">
              {ratingStats.map((count, index) => {
                const starLevel = 5 - index;
                const width = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={starLevel} className='mb-4'>
                    <div className='flex items-center justify-between text-[var(--color-muted)] mb-2'>
                      <span>{starLevel} stars</span>
                      <span>{count}</span>
                    </div>
                    <div className='h-3 rounded-full bg-white/10'>
                      <div className='reviewBar' style={{ width: `${width}%`, background: 'linear-gradient(90deg, rgba(212,175,55,1), rgba(255,255,255,0.65))' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-6">
              {pagedReviews.map((review) => (
                <div key={review._id} className="hotelReviewCard p-6 rounded-[2rem]">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text)]">{review.title}</h3>
                      <p className="text-[var(--color-secondary)]">{review.user.firstName} {review.user.lastName}</p>
                    </div>
                    <div className="text-[var(--color-muted)]">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-1 mt-3 text-[var(--color-secondary)]">
                    {Array.from({ length: review.rating }).map((_, idx) => (<FaStar key={idx} />))}
                  </div>
                  <p className="mt-4 text-[var(--color-text)]">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 gap-4">
              <button disabled={reviewPage === 0} onClick={() => setReviewPage((prev) => Math.max(prev - 1, 0))} className="heroNavButton">Previous</button>
              <button disabled={(reviewPage + 1) * 3 >= reviews.length} onClick={() => setReviewPage((prev) => prev + 1)} className="heroNavButton">Next</button>
            </div>
          </div>
        </section>
      </div>

      {lightboxOpen && (
        <div className="reviewModalBackdrop" onClick={() => setLightboxOpen(false)}>
          <div className="reviewModal" onClick={(e) => e.stopPropagation()}>
            <img className="w-full rounded-[2rem] object-cover" src={galleryImages[selectedImage]} alt='Lightbox' />
            <div className='mt-6 flex items-center justify-between gap-3'>
              <button onClick={() => setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))} className='heroNavButton'>Prev</button>
              <button onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)} className='heroNavButton'>Next</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="reviewModalBackdrop" onClick={() => setShowReviewModal(false)}>
          <div className="reviewModal" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
            <label className="block mb-2">Title</label>
            <input
              value={newReview.title}
              onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
              className="input-glow w-full px-3 py-2 rounded-2xl"
            />
            <label className="block mt-4 mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview((prev) => ({ ...prev, rating: e.target.value }))}
              className="input-glow w-full px-3 py-2 rounded-2xl"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>
            <label className="block mt-4 mb-2">Review</label>
            <textarea
              rows='5'
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              className="input-glow w-full px-3 py-2 rounded-2xl"
            />
            <button onClick={handleReviewSubmit} className="btn-primary mt-4 w-full py-3">Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
};
