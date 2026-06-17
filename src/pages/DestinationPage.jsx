import React, { useMemo, useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaStar, FaHeart, FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { destinationCountries } from '../data/destinationData.js'
import { useCart } from '../context/CartContext.jsx'
import { useImageOverrides } from '../context/ImageOverrideContext.jsx'

const FALLBACK_IMAGE = '/images/photo-1488085061387-422e29b40080.jpg'

const continentLookup = {
  india: 'Asia',
  japan: 'Asia',
  thailand: 'Asia',
  indonesia: 'Asia',
  france: 'Europe',
  italy: 'Europe',
  spain: 'Europe',
  greece: 'Europe',
  egypt: 'Africa',
  kenya: 'Africa',
  tanzania: 'Africa',
  'south-africa': 'Africa',
  australia: 'Oceania',
  brazil: 'Americas',
  mexico: 'Americas',
  usa: 'Americas',
  uae: 'Asia',
}

export const Destination = ({ isHomeSection = false }) => {
  const navigate = useNavigate()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useCart()
  const { getImageUrl } = useImageOverrides()

  const handleWishlistToggle = (location) => {
    if (isInWishlist(location.id)) {
      removeFromWishlist(location.id)
    } else {
      addToWishlist({ id: location.id, name: location.name, imageUrl: location.imageUrl, city: location.city })
    }
  }

  const [selectedContinent, setSelectedContinent] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMood, setSelectedMood] = useState('All')
  const [selectedCountryId, setSelectedCountryId] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const locationUrl = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(locationUrl.search);
    const country = params.get('country');
    if (country) {
      setSelectedCountryId(country);
    }
  }, [locationUrl.search]);

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedContinent, selectedCategory, selectedMood, selectedCountryId])

  const allLocations = useMemo(
    () => destinationCountries.flatMap((country) =>
      country.attractions.map((attraction) => ({
        ...attraction,
        countryName: country.name,
        countryFlag: country.flag,
        countryId: country.id,
        continent: continentLookup[country.id] || 'Other',
      }))
    ),
    []
  )

  const categories = useMemo(
    () => ['All', ...new Set(allLocations.map((location) => location.category))],
    [allLocations]
  )

  const moods = useMemo(() => {
    const uniqueTags = Array.from(new Set(allLocations.flatMap((location) => location.tags || [])))
    const popular = ['Beach', 'Heritage', 'Adventure', 'Romantic', 'Scenic', 'Cultural', 'Luxury', 'Photo Spot', 'Wildlife']
    const ordered = [...popular.filter((tag) => uniqueTags.includes(tag)), ...uniqueTags.filter((tag) => !popular.includes(tag))]
    return ['All', ...ordered.slice(0, 10)]
  }, [allLocations])

  const continents = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania']

  const filteredLocations = useMemo(
    () => allLocations.filter((location) => {
      const continentMatch = selectedContinent === 'All' || location.continent === selectedContinent
      const categoryMatch = selectedCategory === 'All' || location.category === selectedCategory
      const moodMatch = selectedMood === 'All' || (location.tags || []).includes(selectedMood)
      const countryMatch = selectedCountryId === 'All' || location.countryId === selectedCountryId
      return continentMatch && categoryMatch && moodMatch && countryMatch
    }),
    [allLocations, selectedContinent, selectedCategory, selectedMood, selectedCountryId]
  )

  const activeFilter = selectedContinent !== 'All' || selectedCategory !== 'All' || selectedMood !== 'All' || selectedCountryId !== 'All'

  const resetFilters = () => {
    setSelectedContinent('All')
    setSelectedCategory('All')
    setSelectedMood('All')
    setSelectedCountryId('All')
  }

  const itemsPerPage = isHomeSection ? 3 : 9
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage)
  const currentLocations = filteredLocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getSelectClass = (value) => `w-full h-12 md:h-auto rounded-xl border pl-4 pr-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all cursor-pointer appearance-none ${value !== 'All' ? 'bg-teal-500/10 border-teal-400 text-teal-400 font-bold' : 'border-white/10 bg-white/5 text-white font-medium'}`

  return (
    <section id='destination' className='relative bg-slate-950 py-16 lg:py-24 w-full overflow-hidden scroll-mt-20 sm:scroll-mt-24'>

      {/* Subtle grid texture */}
      <div className='absolute inset-0 opacity-[0.02]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* Header */}
        <div className='mb-10 max-w-2xl'>
          <div className='flex items-center gap-3 mb-4'>
            <p className='text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase'>Destination Discovery</p>
          </div>
          <h2 className='text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight'>
            Find your next<br />
            <span className='text-slate-400'>luxury escape.</span>
          </h2>
        </div>

        {/* Filters */}
        {!isHomeSection && (
          <div className='rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='relative'>
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className={getSelectClass(selectedContinent)}
              >
                {continents.map((continent) => (
                  <option key={continent} value={continent} className='bg-slate-900 text-white font-medium'>
                    Continent: {continent}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${selectedContinent !== 'All' ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>

            <div className='relative'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={getSelectClass(selectedCategory)}
              >
                {categories.map((category) => (
                  <option key={category} value={category} className='bg-slate-900 text-white font-medium'>
                    Style: {category}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${selectedCategory !== 'All' ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>

            <div className='relative'>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className={getSelectClass(selectedMood)}
              >
                {moods.map((mood) => (
                  <option key={mood} value={mood} className='bg-slate-900 text-white font-medium'>
                    Mood: {mood}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${selectedMood !== 'All' ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>

            <div className='relative'>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className={getSelectClass(selectedCountryId)}
              >
                <option value='All' className='bg-slate-900 text-white font-medium'>Country: All</option>
                {destinationCountries.map((country) => (
                  <option key={country.id} value={country.id} className='bg-slate-900 text-white font-medium'>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${selectedCountryId !== 'All' ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>
          </div>
        </div>
        )}

        {/* Results Info & Clear All */}
        {!isHomeSection && (
          <div id="destination-results" className='mb-8 flex items-center justify-between px-2 scroll-mt-28'>
            <p className='text-sm font-medium text-slate-400'>
            <span className='text-teal-400 font-bold'>{filteredLocations.length}</span> destinations found
          </p>
          {activeFilter && (
            <button
              type='button'
              onClick={resetFilters}
              className='h-10 rounded-lg px-4 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-all hover:bg-teal-500/10'
            >
              Clear all
            </button>
          )}
        </div>
        )}

        {/* Cards grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentLocations.map((location) => (
            <article
              key={location.id}
              className='group overflow-hidden rounded-2xl bg-white/5 border border-white/8 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/8 hover:shadow-xl hover:shadow-black/20'
            >
              {/* Image */}
              <div className='relative h-56 overflow-hidden bg-slate-800'>
                <img width="800" height="600"
                  src={getImageUrl(location.id, location.imageUrl) || FALLBACK_IMAGE}
                  alt={location.name}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  loading='lazy'
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent' />

                {/* Rating badge */}
                <div className='absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-teal-400 border border-white/10'>
                  <FaStar className='text-teal-400 text-[10px]' /> {location.rating.toFixed(1)}
                </div>

                {/* Wishlist heart */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleWishlistToggle(location); }}
                  className={`absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
                    isInWishlist(location.id)
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                      : 'bg-slate-950/60 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                  }`}
                  aria-label={isInWishlist(location.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FaHeart className='text-xs' />
                </button>

                {/* Name on image */}
                <div className='absolute bottom-4 left-4 right-4'>
                  <h4 className='text-lg font-bold text-white leading-snug'>{location.name}</h4>
                  <p className='text-xs text-white/60 mt-0.5 font-medium'>{location.countryFlag} {location.countryName}</p>
                </div>
              </div>

              {/* Body */}
              <div className='space-y-3 p-5'>
                {/* Location */}
                <div className='flex items-center gap-2 text-sm text-slate-400'>
                  <FaMapMarkerAlt className='text-teal-500 text-xs' /> {location.city}
                </div>

                {/* Stats row */}
                <div className='grid grid-cols-3 gap-2 text-[11px]'>
                  <div className='rounded-lg bg-white/5 border border-white/5 p-2.5 text-center'>
                    <p className='text-slate-500 uppercase tracking-[0.08em]'>Fee</p>
                    <p className='font-bold text-white mt-0.5'>${location.entryFee}</p>
                  </div>
                  <div className='rounded-lg bg-white/5 border border-white/5 p-2.5 text-center'>
                    <p className='text-slate-500 uppercase tracking-[0.08em]'>Duration</p>
                    <p className='font-bold text-white mt-0.5'>{location.duration}</p>
                  </div>
                  <div className='rounded-lg bg-white/5 border border-white/5 p-2.5 text-center'>
                    <p className='text-slate-500 uppercase tracking-[0.08em]'>Best time</p>
                    <p className='font-bold text-white mt-0.5'>{location.bestTime}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-1.5'>
                  {location.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className='rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-teal-400'>{tag}</span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type='button'
                  onClick={() => navigate(`/attraction/${location.id}`)}
                  className='w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]'
                >
                  View & Book
                </button>
              </div>
            </article>
          ))}
        </div>

        {!isHomeSection ? (
          <>
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                
                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all border ${
                        currentPage === page 
                          ? 'bg-teal-500 border-teal-400 text-white shadow-lg shadow-teal-500/20' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

            {filteredLocations.length === 0 && (
              <div className='rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center'>
                <p className='text-lg font-bold text-white'>No matches yet.</p>
                <p className='mt-2 text-sm text-slate-400'>Try different filters to discover destinations.</p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate('/destinations')}
              className="rounded-xl border border-teal-500 text-teal-400 px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:bg-teal-500 hover:text-white transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            >
              View More Destinations
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
