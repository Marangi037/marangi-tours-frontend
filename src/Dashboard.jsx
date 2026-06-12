import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaImage, FaGlobeAfrica, FaMapMarkerAlt, FaStar, FaCheck, FaUndo, FaSearch, FaTrash } from 'react-icons/fa'
import { destinationCountries } from './destinationData.js'
import { useImageOverrides } from './context/ImageOverrideContext.jsx'

const FALLBACK_IMAGE = '/images/photo-1488085061387-422e29b40080.jpg'

export const Dashboard = () => {
  const { overrides, getImageUrl, setImageOverride, clearOverride, clearAllOverrides } = useImageOverrides()
  const [editingId, setEditingId] = useState(null)
  const [editUrl, setEditUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  // Flatten all attractions
  const allAttractions = useMemo(() =>
    destinationCountries.flatMap((country) =>
      country.attractions.map((a) => ({
        ...a,
        countryName: country.name,
        countryFlag: country.flag,
        countryId: country.id,
      }))
    ), []
  )

  // Stats
  const totalCountries = destinationCountries.length
  const totalAttractions = allAttractions.length
  const totalOverrides = Object.keys(overrides).length
  const categories = [...new Set(allAttractions.map((a) => a.category))]

  // Filtered by search
  const filteredAttractions = useMemo(() => {
    if (!searchQuery.trim()) return allAttractions
    const q = searchQuery.toLowerCase()
    return allAttractions.filter((a) =>
      [a.name, a.city, a.country, a.category, ...(a.tags || [])].join(' ').toLowerCase().includes(q)
    )
  }, [allAttractions, searchQuery])

  const handleEdit = (attraction) => {
    setEditingId(attraction.id)
    setEditUrl(overrides[attraction.id] || attraction.imageUrl)
    setPreviewUrl(overrides[attraction.id] || attraction.imageUrl)
  }

  const handleSave = (attractionId) => {
    if (editUrl.trim()) {
      setImageOverride(attractionId, editUrl.trim())
      setSavedMessage(attractionId)
      setTimeout(() => setSavedMessage(''), 2000)
    }
    setEditingId(null)
    setEditUrl('')
    setPreviewUrl('')
  }

  const handleReset = (attractionId) => {
    clearOverride(attractionId)
    setEditingId(null)
    setEditUrl('')
    setPreviewUrl('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditUrl('')
    setPreviewUrl('')
  }

  return (
    <div className='min-h-screen bg-slate-950'>
      {/* Header */}
      <div className='border-b border-white/10 bg-slate-950/95 backdrop-blur-lg sticky top-0 z-30'>
        <div className='mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link
              to='/'
              className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-all'
            >
              <FaArrowLeft className='text-xs' /> Back to Site
            </Link>
            <div>
              <h1 className='text-lg sm:text-xl font-bold text-white'>Dashboard</h1>
              <p className='text-xs text-slate-500 hidden sm:block'>Manage site images and content</p>
            </div>
          </div>
          {totalOverrides > 0 && (
            <button
              onClick={clearAllOverrides}
              className='flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all'
            >
              <FaUndo className='text-xs' /> Reset All ({totalOverrides})
            </button>
          )}
        </div>
      </div>

      <div className='mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8'>
          <div className='rounded-xl bg-white/5 border border-white/8 p-4 sm:p-5'>
            <div className='flex items-center gap-2 text-teal-400 mb-2'>
              <FaGlobeAfrica className='text-sm' />
              <span className='text-xs font-semibold uppercase tracking-wider'>Countries</span>
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-white'>{totalCountries}</p>
          </div>
          <div className='rounded-xl bg-white/5 border border-white/8 p-4 sm:p-5'>
            <div className='flex items-center gap-2 text-purple-400 mb-2'>
              <FaMapMarkerAlt className='text-sm' />
              <span className='text-xs font-semibold uppercase tracking-wider'>Attractions</span>
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-white'>{totalAttractions}</p>
          </div>
          <div className='rounded-xl bg-white/5 border border-white/8 p-4 sm:p-5'>
            <div className='flex items-center gap-2 text-amber-400 mb-2'>
              <FaStar className='text-sm' />
              <span className='text-xs font-semibold uppercase tracking-wider'>Categories</span>
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-white'>{categories.length}</p>
          </div>
          <div className='rounded-xl bg-white/5 border border-white/8 p-4 sm:p-5'>
            <div className='flex items-center gap-2 text-emerald-400 mb-2'>
              <FaImage className='text-sm' />
              <span className='text-xs font-semibold uppercase tracking-wider'>Overrides</span>
            </div>
            <p className='text-2xl sm:text-3xl font-bold text-white'>{totalOverrides}</p>
          </div>
        </div>

        {/* Image Manager Section */}
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-white'>Site Images</h2>
              <p className='text-sm text-slate-400 mt-1'>Click on any attraction to edit its image URL</p>
            </div>
            <div className='relative w-full sm:w-auto'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search attractions...'
                className='w-full sm:w-64 rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all'
              />
            </div>
          </div>

          {/* Attraction cards grid */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredAttractions.map((attraction) => {
              const isEditing = editingId === attraction.id
              const hasOverride = !!overrides[attraction.id]
              const currentImage = getImageUrl(attraction.id, attraction.imageUrl)

              return (
                <div
                  key={attraction.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isEditing
                      ? 'border-teal-500/40 bg-teal-500/5'
                      : hasOverride
                        ? 'border-emerald-500/20 bg-white/5'
                        : 'border-white/8 bg-white/5'
                  }`}
                >
                  {/* Image preview */}
                  <div className='relative h-40 sm:h-48 overflow-hidden bg-slate-800'>
                    <img
                      src={isEditing && previewUrl ? previewUrl : currentImage || FALLBACK_IMAGE}
                      alt={attraction.name}
                      className='h-full w-full object-cover'
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent' />

                    {/* Status badges */}
                    <div className='absolute top-3 right-3 flex gap-1.5'>
                      {hasOverride && (
                        <span className='rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider'>
                          Custom
                        </span>
                      )}
                      {savedMessage === attraction.id && (
                        <span className='rounded-full bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-400 flex items-center gap-1'>
                          <FaCheck className='text-[8px]' /> Saved
                        </span>
                      )}
                    </div>

                    {/* Info overlay */}
                    <div className='absolute bottom-3 left-3 right-3'>
                      <p className='text-sm font-bold text-white'>{attraction.name}</p>
                      <p className='text-xs text-white/60 mt-0.5'>{attraction.countryFlag} {attraction.city}, {attraction.country}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className='p-4'>
                    {isEditing ? (
                      <div className='space-y-3'>
                        <div>
                          <label className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>Image URL</label>
                          <input
                            type='url'
                            value={editUrl}
                            onChange={(e) => {
                              setEditUrl(e.target.value)
                              setPreviewUrl(e.target.value)
                            }}
                            placeholder='Paste Unsplash or image URL...'
                            className='w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400 transition-all'
                            autoFocus
                          />
                        </div>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleSave(attraction.id)}
                            className='flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-all'
                          >
                            <FaCheck className='text-xs' /> Save
                          </button>
                          {hasOverride && (
                            <button
                              onClick={() => handleReset(attraction.id)}
                              className='flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all'
                            >
                              <FaUndo className='text-xs' />
                            </button>
                          )}
                          <button
                            onClick={handleCancel}
                            className='flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-400 hover:text-white transition-all'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 min-w-0'>
                          <span className='rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] text-slate-400 uppercase tracking-wider'>
                            {attraction.category}
                          </span>
                          <span className='flex items-center gap-0.5 text-xs text-slate-500'>
                            <FaStar className='text-amber-400 text-[9px]' /> {attraction.rating}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit(attraction)}
                          className='flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all'
                        >
                          <FaImage className='text-[10px]' /> Edit Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredAttractions.length === 0 && (
            <div className='text-center py-16'>
              <FaSearch className='text-3xl text-slate-700 mx-auto mb-3' />
              <p className='text-slate-400'>No attractions match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
