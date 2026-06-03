import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaHeart, FaMapMarkerAlt, FaPlus, FaMinus, FaStar, FaUsers, FaClock, FaTag, FaShareAlt, FaInfoCircle, FaChevronLeft, FaChevronRight, FaTimes, FaCopy } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './context/CartContext.jsx'
import { getAttractionById, getSimilarAttractions } from './destinationData.js'

export const AttractionDetail = () => {
  const { attractionId } = useParams()
  const navigate = useNavigate()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart()
  const attraction = getAttractionById(attractionId)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [visitDate, setVisitDate] = useState(today)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [error, setError] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  const galleryImages = useMemo(
    () => [
      attraction?.imageUrl,
      attraction?.imageUrl?.replace('w=800', 'w=1200'),
      attraction?.imageUrl?.replace('w=800', 'w=1600'),
    ].filter(Boolean),
    [attraction]
  )

  const recommendations = useMemo(() => {
    if (!attraction) return []
    return getSimilarAttractions(attraction)
  }, [attraction])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [attractionId])

  const isSaved = isInWishlist(attraction?.id)
  const totalVisitors = Math.max(1, adults + children)
  const totalPrice = attraction ? attraction.entryFee * totalVisitors : 0

  if (!attraction) {
    return (
      <div className='min-h-screen bg-slate-950 flex items-center justify-center px-4'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-10 text-center shadow-2xl'
        >
          <div className='text-6xl mb-6'>🔍</div>
          <h2 className='text-3xl font-bold text-white'>Attraction Not Found</h2>
          <p className='mt-4 text-slate-400 leading-relaxed'>We couldn't find this destination. Let's get you back to exploring amazing places.</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')} 
            className='mt-8 rounded-xl bg-teal-500 px-8 py-4 text-white font-semibold shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all'
          >
            Explore Destinations
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const handleWishlist = () => {
    if (isSaved) {
      removeFromWishlist(attraction.id)
    } else {
      addToWishlist({ id: attraction.id, name: attraction.name, imageUrl: attraction.imageUrl, city: attraction.city })
    }
  }

  const handleBooking = () => {
    if (!visitDate) {
      setError('Please select a visit date')
      return
    }
    setError('')
    const ref = `EXP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    
    navigate(`/checkout/attr-${ref}`, {
      state: {
        type: 'attraction',
        item: attraction,
        visitDate,
        totalVisitors,
        totalPrice,
      }
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: attraction.name,
        text: `Check out ${attraction.name} in ${attraction.city}, ${attraction.country}!`,
        url: window.location.href,
      })
    } catch {
      // Fallback
    }
  }

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % galleryImages.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)

  return (
    <div className='min-h-screen bg-slate-950'>
      {/* Floating Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='fixed top-6 left-6 z-40'
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')} 
          className='flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-lg px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 hover:border-teal-500/30 transition-all'
        >
          <FaArrowLeft className='text-sm' /> Back
        </motion.button>
      </motion.div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='fixed bottom-8 right-8 z-40 rounded-xl bg-teal-500 p-4 text-white shadow-lg hover:bg-teal-400 transition-all'
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16'>
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid gap-8 lg:grid-cols-[1.3fr_1fr]'
        >
          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='relative overflow-hidden rounded-2xl bg-slate-800 shadow-2xl group'>
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[selectedImage]} 
                alt={attraction.name} 
                className='h-[300px] sm:h-[400px] lg:h-[500px] w-full object-cover cursor-pointer'
                onClick={() => setShowLightbox(true)}
              />
              
              {/* Image Navigation */}
              <button onClick={prevImage} className='absolute left-4 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900/80 backdrop-blur-sm p-3 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-800 shadow-lg'>
                <FaChevronLeft />
              </button>
              <button onClick={nextImage} className='absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-slate-900/80 backdrop-blur-sm p-3 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-800 shadow-lg'>
                <FaChevronRight />
              </button>

              {/* Wishlist & Share */}
              <div className='absolute top-4 right-4 flex gap-2'>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist} 
                  className='rounded-xl bg-slate-900/80 backdrop-blur-sm p-3 shadow-lg hover:bg-slate-800 transition-all'
                >
                  <FaHeart className={`text-lg ${isSaved ? 'text-red-500' : 'text-white/50'}`} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare} 
                  className='rounded-xl bg-slate-900/80 backdrop-blur-sm p-3 shadow-lg hover:bg-slate-800 transition-all'
                >
                  <FaShareAlt className='text-lg text-white/50' />
                </motion.button>
              </div>

              {/* Image counter */}
              <div className='absolute bottom-4 left-4 rounded-xl bg-slate-900/80 backdrop-blur-sm px-4 py-2 text-sm text-white'>
                {selectedImage + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className='flex gap-3 overflow-x-auto pb-2'>
              {galleryImages.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-teal-400 shadow-lg shadow-teal-400/25' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`${attraction.name} ${index + 1}`} className='h-full w-full object-cover' />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 shadow-2xl h-fit lg:sticky lg:top-28'
          >
            <div className='flex items-center gap-2 mb-2'>
              <span className='px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold'>
                {attraction.category}
              </span>
              <span className='px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1'>
                <FaStar className='text-amber-400' /> {attraction.rating}
              </span>
            </div>
            
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3'>{attraction.name}</h1>
            
            <div className='flex items-center gap-2 mt-3 text-slate-400'>
              <FaMapMarkerAlt className='text-teal-400' />
              <span className='font-medium'>{attraction.city}, {attraction.country}</span>
            </div>

            <p className='mt-5 text-slate-400 leading-relaxed line-clamp-4'>{attraction.description}</p>

            <div className='grid grid-cols-2 gap-3 mt-6'>
              <div className='rounded-xl bg-white/5 border border-white/5 p-4'>
                <div className='flex items-center gap-2 text-teal-400 mb-1'>
                  <FaTag className='text-sm' />
                  <span className='text-xs font-semibold uppercase tracking-wide'>Entry Fee</span>
                </div>
                <p className='text-2xl font-bold text-white'>${attraction.entryFee}</p>
                <p className='text-xs text-slate-500 mt-1'>per person</p>
              </div>
              <div className='rounded-xl bg-white/5 border border-white/5 p-4'>
                <div className='flex items-center gap-2 text-purple-400 mb-1'>
                  <FaClock className='text-sm' />
                  <span className='text-xs font-semibold uppercase tracking-wide'>Duration</span>
                </div>
                <p className='text-2xl font-bold text-white'>{attraction.duration}</p>
                <p className='text-xs text-slate-500 mt-1'>approx</p>
              </div>
              <div className='rounded-xl bg-white/5 border border-white/5 p-4'>
                <div className='flex items-center gap-2 text-emerald-400 mb-1'>
                  <FaCalendarAlt className='text-sm' />
                  <span className='text-xs font-semibold uppercase tracking-wide'>Best Time</span>
                </div>
                <p className='text-lg font-bold text-white'>{attraction.bestTime}</p>
              </div>
              <div className='rounded-xl bg-white/5 border border-white/5 p-4'>
                <div className='flex items-center gap-2 text-rose-400 mb-1'>
                  <FaUsers className='text-sm' />
                  <span className='text-xs font-semibold uppercase tracking-wide'>Rating</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-2xl font-bold text-white'>{attraction.rating}</span>
                  <FaStar className='text-amber-400' />
                </div>
                <p className='text-xs text-slate-500 mt-1'>{attraction.reviews?.length || 0} reviews</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className='mt-10 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 lg:p-10'>
          <div className='space-y-10'>
            <div>
              <h2 className='text-2xl font-bold text-white'>About {attraction.name}</h2>
              <p className='mt-4 text-slate-400 leading-relaxed text-base sm:text-lg'>{attraction.description}</p>
            </div>

            <div className='grid gap-6 lg:grid-cols-[1.45fr_0.95fr]'>
              <div className='space-y-6'>
                <div className='grid sm:grid-cols-2 gap-4 sm:gap-6'>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-5 sm:p-6'>
                    <h3 className='font-semibold text-white mb-3'>📍 Location</h3>
                    <p className='text-slate-400'>{attraction.city}, {attraction.country}</p>
                  </div>
                  <div className='rounded-xl bg-white/5 border border-white/5 p-5 sm:p-6'>
                    <h3 className='font-semibold text-white mb-3'>🏷️ Tags</h3>
                    <div className='flex flex-wrap gap-2'>
                      {attraction.tags?.map((tag) => (
                        <span key={tag} className='px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-sm text-teal-400'>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div>
                    <h3 className='text-xl font-bold text-white mb-4'>✨ You Might Also Like</h3>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                      {recommendations.slice(0, 4).map((rec) => (
                        <motion.div
                          key={rec.id}
                          whileHover={{ y: -4 }}
                          onClick={() => navigate(`/attraction/${rec.id}`)}
                          className='cursor-pointer rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/8 hover:border-white/15 transition-all'
                        >
                          <img src={rec.imageUrl} alt={rec.name} className='h-28 sm:h-40 w-full object-cover' />
                          <div className='p-3 sm:p-4'>
                            <p className='font-semibold text-white text-sm truncate'>{rec.name}</p>
                            <p className='text-xs text-slate-500 mt-1'>{rec.city}, {rec.country}</p>
                            <div className='flex items-center gap-1 mt-2'>
                              <FaStar className='text-amber-400 text-xs' />
                              <span className='text-sm font-semibold text-white'>{rec.rating}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6'>
                <h3 className='text-xl sm:text-2xl font-bold text-white'>Reserve your experience</h3>
                <p className='mt-3 text-slate-400 text-sm sm:text-base'>Select a date, guests, and confirm your premium booking.</p>

                <div className='mt-6 space-y-4 sm:space-y-5'>
                  <div>
                    <label className='block text-sm font-semibold text-slate-400 mb-2'>Select Date</label>
                    <input
                      type='date'
                      value={visitDate}
                      min={today}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className='w-full rounded-xl border border-white/10 bg-white/5 px-4 sm:px-5 py-3 sm:py-4 text-white outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                    <div className='rounded-xl bg-white/5 border border-white/5 p-4 sm:p-5'>
                      <p className='text-sm font-semibold text-slate-400 mb-3'>Adults</p>
                      <div className='flex items-center justify-between'>
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/10 text-teal-400 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-all'
                        >
                          <FaMinus />
                        </button>
                        <span className='text-xl sm:text-2xl font-bold text-white'>{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-400 transition-all'
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <div className='rounded-xl bg-white/5 border border-white/5 p-4 sm:p-5'>
                      <p className='text-sm font-semibold text-slate-400 mb-3'>Children</p>
                      <div className='flex items-center justify-between'>
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/10 text-teal-400 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-all'
                        >
                          <FaMinus />
                        </button>
                        <span className='text-xl sm:text-2xl font-bold text-white'>{children}</span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-400 transition-all'
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='rounded-xl bg-teal-500/10 border border-teal-500/20 p-5 sm:p-6'>
                    <div className='flex items-center justify-between text-teal-300 text-sm'>
                      <span>${attraction.entryFee} × {totalVisitors} visitor{totalVisitors > 1 ? 's' : ''}</span>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                      <span className='text-lg font-semibold text-white'>Total</span>
                      <span className='text-2xl sm:text-3xl font-bold text-white'>${totalPrice}</span>
                    </div>
                  </div>

                  {error && (
                    <p className='rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm text-red-400'>
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleBooking}
                    className='w-full rounded-xl bg-teal-500 px-6 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-xl shadow-teal-500/20 hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/25 transition-all active:scale-[0.98]'
                  >
                    Checkout — ${totalPrice}
                  </button>

                  <div className='rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 sm:p-5'>
                    <p className='font-semibold text-emerald-400 mb-3'>✓ Booking Includes</p>
                    <ul className='space-y-2 text-sm text-emerald-300/80'>
                      <li className='flex items-center gap-2'><FaCheck className='text-emerald-400 flex-shrink-0' /> Free cancellation up to 24 hours</li>
                      <li className='flex items-center gap-2'><FaCheck className='text-emerald-400 flex-shrink-0' /> Instant confirmation</li>
                      <li className='flex items-center gap-2'><FaCheck className='text-emerald-400 flex-shrink-0' /> Best price guarantee</li>
                      <li className='flex items-center gap-2'><FaCheck className='text-emerald-400 flex-shrink-0' /> Mobile ticket accepted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center'
            onClick={() => setShowLightbox(false)}
          >
            <button 
              onClick={() => setShowLightbox(false)}
              className='absolute top-6 right-6 text-white text-3xl hover:text-slate-300 transition-all z-10'
            >
              <FaTimes />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className='absolute left-6 text-white text-3xl hover:text-slate-300 transition-all'
            >
              <FaChevronLeft />
            </button>
            <motion.img 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={galleryImages[selectedImage]} 
              alt={attraction.name} 
              className='max-h-[85vh] max-w-[90vw] object-contain rounded-2xl'
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className='absolute right-6 text-white text-3xl hover:text-slate-300 transition-all'
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}