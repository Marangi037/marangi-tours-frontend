import React, { useEffect, useMemo, useRef, useState } from 'react'

const defaultTestimonials = [
  {
    id: 1,
    name: 'Evelyn Hart',
    location: 'Nairobi, Kenya',
    role: 'Luxury Safari Traveller',
    hotel: 'Savannah Lodge Retreat',
    review:
      'From the moment we arrived, every detail felt curated for a once-in-a-lifetime escape. The room overlooked the plains, the service was refined but warm, and the dining experience felt like a story told through taste.',
    image:
      '/images/photo-1505693416388-ac5ce068fe85.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mila Chen',
    location: 'Kyoto, Japan',
    role: 'Cultural Explorer',
    hotel: 'Horizon Silk Hotel',
    review:
      'This stay was a graceful blend of calm architecture and true hospitality. Each sunrise on the balcony felt cinematic, and the quiet moments in the spa made the whole journey memorable.',
    image:
      '/images/photo-1506744038136-46273834b3fb.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Noah Rivera',
    location: 'Positano, Italy',
    role: 'Boutique Hotel Hunter',
    hotel: 'Azure Cliffside',
    review:
      'Every corner of the property felt deliberately beautiful. The view, the curated service, and the luxury touches made the stay feel effortless yet unforgettable.',
    image:
      '/images/photo-1496417263034-38ec4f0b665a.jpg',
    rating: 5,
  },
]

const Star = ({ filled = true }) => (
  <svg viewBox='0 0 24 24' className={`h-4 w-4 ${filled ? 'fill-teal-400' : 'fill-slate-600'}`} aria-hidden='true'>
    <path d='M12 2.1l2.9 6 6.6.9-4.8 4.7 1.2 6.5L12 17.8l-5.9 3.1 1.2-6.5L2.5 9 9.1 8.1 12 2.1z' />
  </svg>
)

const Arrow = ({ direction = 'left' }) => (
  <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    {direction === 'left' ? <path d='M15 18l-6-6 6-6' /> : <path d='M9 18l6-6-6-6' />}
  </svg>
)

export const Testimonials = ({ testimonials }) => {
  const slides = useMemo(() => (Array.isArray(testimonials) && testimonials.length ? testimonials : defaultTestimonials), [testimonials])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState('next')
  const intervalRef = useRef(null)

  const activeTestimonial = slides[activeIndex]

  useEffect(() => {
    window.clearInterval(intervalRef.current)
    if (isHovered) return () => window.clearInterval(intervalRef.current)

    intervalRef.current = window.setInterval(() => {
      setDirection('next')
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(intervalRef.current)
  }, [isHovered, slides.length, activeIndex])

  const handlePrev = () => {
    setDirection('prev')
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
    window.clearInterval(intervalRef.current)
  }

  const handleNext = () => {
    setDirection('next')
    setActiveIndex((current) => (current + 1) % slides.length)
    window.clearInterval(intervalRef.current)
  }

  return (
    <section
      id='reviews'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28'
    >
      {/* Subtle background texture */}
      <div className='absolute inset-0 opacity-[0.03]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* Header */}
        <div className='mb-16 max-w-2xl'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <p className='text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase'>What Travelers Say</p>
          </div>
          <h2 className='text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight'>
            Real experiences,<br />
            <span className='text-slate-400'>real memories.</span>
          </h2>
        </div>

        {/* Content grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center'>

          {/* Left: Image */}
          <div className='relative h-[350px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden group'>
            {slides.map((slide, i) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={`${slide.name} travel scene`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  i === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              />
            ))}

            {/* Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />

            {/* Name overlay on image */}
            <div className='absolute bottom-6 left-6 right-6'>
              <div className='flex items-center gap-1 mb-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < activeTestimonial.rating} />
                ))}
              </div>
              <p className='text-xl font-bold text-white'>{activeTestimonial.name}</p>
              <p className='text-sm text-white/60 mt-0.5'>{activeTestimonial.role}</p>
            </div>

            {/* Corner badge */}
            <div className='absolute top-5 left-5 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full'>
              {activeTestimonial.location}
            </div>
          </div>

          {/* Right: Quote & controls */}
          <div className='flex flex-col justify-center'>

            {/* Quote */}
            <div className='relative'>
              <span className='absolute -left-2 -top-4 text-7xl font-serif text-teal-500/20 leading-none select-none' aria-hidden='true'>"</span>
              <blockquote className='relative text-xl sm:text-2xl lg:text-[1.7rem] leading-relaxed text-slate-200 font-light italic'>
                {activeTestimonial.review}
              </blockquote>
            </div>

            {/* Hotel info */}
            <div className='mt-8 flex items-center gap-3 border-l-2 border-teal-500 pl-4'>
              <div>
                <p className='text-sm font-semibold text-white'>{activeTestimonial.name}</p>
                <p className='text-xs text-slate-400 mt-0.5'>Reviewed: <span className='text-teal-400'>{activeTestimonial.hotel}</span></p>
              </div>
            </div>

            {/* Navigation */}
            <div className='mt-10 flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handlePrev}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-90'
                  aria-label='Previous testimonial'
                >
                  <Arrow direction='left' />
                </button>
                <button
                  type='button'
                  onClick={handleNext}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-90'
                  aria-label='Next testimonial'
                >
                  <Arrow direction='right' />
                </button>
              </div>

              {/* Dots */}
              <div className='flex items-center gap-2'>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => { setDirection(index > activeIndex ? 'next' : 'prev'); setActiveIndex(index) }}
                    className={`rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 h-2 bg-teal-400' : 'w-2 h-2 bg-white/25 hover:bg-white/40'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Counter */}
              <p className='text-sm text-white/40 tabular-nums ml-auto'>
                {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
