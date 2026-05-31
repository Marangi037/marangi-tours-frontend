import React, { useMemo, useState } from 'react'
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { destinationCountries } from './destinationData.js'
import { useCart } from './context/CartContext.jsx'
import { useImageOverrides } from './context/ImageOverrideContext.jsx'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80&auto=format&fit=crop'

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

export const Destination = () => {
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

  return (
    <section id='destination' className='relative bg-slate-950 py-16 lg:py-24 w-screen overflow-hidden' style={{ marginLeft: 'calc(50% - 50vw)' }}>

      {/* Subtle grid texture */}
      <div className='absolute inset-0 opacity-[0.02]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className='relative w-full px-6 lg:px-12 max-w-[1400px] mx-auto'>

        {/* Header */}
        <div className='mb-10 max-w-2xl'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='h-px w-8 bg-teal-400' />
            <p className='text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase'>Destination Discovery</p>
          </div>
          <h2 className='text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight'>
            Find your next<br />
            <span className='text-slate-400'>luxury escape.</span>
          </h2>
        </div>

        {/* Filters */}
        <div className='rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 mb-10'>
          <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'>
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all cursor-pointer'
            >
              {continents.map((continent) => (
                <option key={continent} value={continent} className='bg-slate-900 text-white'>
                  Continent: {continent}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all cursor-pointer'
            >
              {categories.map((category) => (
                <option key={category} value={category} className='bg-slate-900 text-white'>
                  Style: {category}
                </option>
              ))}
            </select>

            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all cursor-pointer'
            >
              {moods.map((mood) => (
                <option key={mood} value={mood} className='bg-slate-900 text-white'>
                  Mood: {mood}
                </option>
              ))}
            </select>

            <select
              value={selectedCountryId}
              onChange={(e) => setSelectedCountryId(e.target.value)}
              className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all cursor-pointer'
            >
              <option value='All' className='bg-slate-900 text-white'>Country: All</option>
              {destinationCountries.map((country) => (
                <option key={country.id} value={country.id} className='bg-slate-900 text-white'>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>

            {activeFilter && (
              <button
                type='button'
                onClick={resetFilters}
                className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-teal-400/50'
              >
                ✕ Reset
              </button>
            )}
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-400'>
              <span className='text-teal-400 font-bold'>{filteredLocations.length}</span> destinations found
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredLocations.slice(0, 9).map((location) => (
            <article
              key={location.id}
              className='group overflow-hidden rounded-2xl bg-white/5 border border-white/8 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/8 hover:shadow-xl hover:shadow-black/20'
            >
              {/* Image */}
              <div className='relative h-56 overflow-hidden bg-slate-800'>
                <img
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

        {filteredLocations.length === 0 && (
          <div className='rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center'>
            <p className='text-lg font-bold text-white'>No matches yet.</p>
            <p className='mt-2 text-sm text-slate-400'>Try different filters to discover destinations.</p>
          </div>
        )}
      </div>
    </section>
  )
}
