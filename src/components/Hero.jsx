import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();
  const slides = [
    {
      label: 'KENYA',
      subtitle: 'Maasai Mara Safari',
      image: '/images/photo-1547471080-7cc2caa01a7e.jpg',
      location: 'Kenya, East Africa',
      description: 'Wild savannahs teeming with lions, elephants, and beautifully endless skies.',
      slug: 'kenya',
      countryId: 'kenya',
    },
    {
      label: 'TANZANIA',
      subtitle: 'Mount Kilimanjaro',
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1920&q=80&auto=format&fit=crop',
      location: 'Tanzania, East Africa',
      description: 'Majestic snowy peaks rising above sweeping plains and abundant wildlife.',
      slug: 'tanzania',
      countryId: 'tanzania',
    },
    {
      label: 'ZANZIBAR',
      subtitle: 'Pristine Beaches',
      image: '/images/photo-1586861635167-e5223aadc9fe.jpg',
      location: 'Zanzibar, Tanzania',
      description: 'Pristine white sand beaches meeting crystal clear turquoise ocean waters.',
      slug: 'zanzibar',
      countryId: 'tanzania',
    },
    {
      label: 'MOMBASA',
      subtitle: 'Coastal Paradise',
      image: '/images/photo-1590523277543-a94d2e4eb00b.jpg',
      location: 'Mombasa, Kenya',
      description: 'Beautiful coastal paradise featuring historic sites and sunny tropical beaches.',
      slug: 'mombasa',
      countryId: 'kenya',
    },
    {
      label: 'SERENGETI',
      subtitle: 'Great Migration',
      image: '/images/photo-1549366021-9f761d450615.jpg',
      location: 'Serengeti, Tanzania',
      description: 'Witness the spectacular great migration across vast endless golden plains.',
      slug: 'serengeti',
      countryId: 'tanzania',
    },
    {
      label: 'CAPE TOWN',
      subtitle: 'Mountain & Ocean',
      image: '/images/photo-1580060839134-75a5edca2e99.jpg',
      location: 'Cape Town, South Africa',
      description: 'Stunning coastal city surrounded by dramatic mountains and rolling vineyards.',
      slug: 'cape-town',
      countryId: 'south-africa',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);
  const total = slides.length;

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + total) % total);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Auto-play */
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const manual = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(next, 5000);
  };



  /* Visible cards: show 3 cards around the current one */
  const getVisibleSlides = () => {
    const prev = (current - 1 + total) % total;
    const next = (current + 1) % total;
    return [prev, current, next];
  };
  const visibleIndices = getVisibleSlides();

  const handleExploreClick = (e, slide) => {
    e.preventDefault();
    navigate(`/destinations?country=${slide.countryId}`);
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden bg-slate-950 text-white">


      {/* ── Full-bleed background that crossfades with current slide ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.label}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? 0.4 : 0,
          }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-slate-950/70" />

      {/* ── Content ── */}
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-6 pt-24 pb-20 md:pb-8 lg:px-12 font-body justify-center">

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div className="hidden md:flex flex-col justify-center space-y-5 z-10 max-w-xl">

            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">
                Discover
              </p>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col space-y-4"
                >
                  <div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight md:leading-[1.08]">
                      {slides[current].label}
                    </h1>
                    <p className="text-sm text-white/60 mt-2 tracking-wide uppercase">
                      {slides[current].location}
                    </p>
                  </div>
                  
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-md">
                    {slides[current].description}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <a
                      href={`/destinations?country=${slides[current].countryId}`}
                      onClick={(e) => handleExploreClick(e, slides[current])}
                      className="group inline-flex items-center gap-2 rounded-full bg-teal-500 px-7 py-3 text-sm font-semibold !text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25"
                    >
                      Explore {slides[current].label}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Layout Wrapper */}
          <div className="md:hidden absolute inset-0 flex flex-col justify-end pb-[100px] pointer-events-none z-20">
            <div className="pointer-events-auto flex flex-col items-center w-full">
              {/* Mobile Text Hierarchy */}
              <div className="flex flex-col items-center justify-center mb-6 z-10 w-full px-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center space-y-3 drop-shadow-md"
                  >
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-teal-400 uppercase">
                        Discover
                      </p>
                    </div>

                    {/* Name & Location */}
                    <div className="flex flex-col items-center">
                      <h2 className="text-3xl font-display font-bold text-white leading-tight">
                        {slides[current].label}
                      </h2>
                      <p className="text-xs text-white/70 mt-1 tracking-wide uppercase">
                        {slides[current].location}
                      </p>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm font-medium leading-relaxed text-white max-w-sm px-2">
                      {slides[current].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile: 3-item carousel */}
              <div 
                className="relative w-full h-[220px] flex justify-center items-center overflow-hidden touch-pan-y shrink-0"
              >
                <AnimatePresence initial={false}>
              {slides.map((slide, index) => {
                const pos = visibleIndices.indexOf(index);
                if (pos === -1) return null;

                const isCenter = pos === 1;
                const isLeft = pos === 0;

                let translateX = 0;
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;
                let rotate = 0;

                if (isCenter) {
                  translateX = 0;
                  scale = 1;
                  zIndex = 30;
                  opacity = 1;
                } else if (isLeft) {
                  translateX = -100;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.5;
                  rotate = -3;
                } else {
                  translateX = 100;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.5;
                  rotate = 3;
                }

                return (
                  <motion.div
                    key={slide.label}
                    initial={{ x: isLeft ? -130 : 130, opacity: 0, scale: 0.8 }}
                    animate={{ x: translateX, opacity, scale, rotate, zIndex }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x;
                      if (swipe < -50) {
                        manual(next);
                      } else if (swipe > 50) {
                        manual(prev);
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      if (!isCenter) manual(() => goTo(index));
                    }}
                  >
                    <div className={`relative w-[160px] h-[210px] rounded-2xl overflow-hidden shadow-2xl group ${isCenter ? 'ring-2 ring-teal-400/40' : ''}`}>
                      <img width="800" height="600"
                        src={slide.image}
                        alt={`${slide.label} – ${slide.subtitle}`}
                        className="h-full w-full object-cover"
                        loading={index < 3 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-base font-bold text-white tracking-wide font-display">{slide.label}</p>
                        <p className="text-[10px] text-white/60 tracking-wider mt-0.5 font-medium font-body">{slide.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

              </div>

              {/* Mobile CTA Button */}
              <div className="flex justify-center mt-6 z-10 w-full">
                <a
                  href={`/destinations?country=${slides[current].countryId}`}
                  onClick={(e) => handleExploreClick(e, slides[current])}
                  className="group inline-flex items-center gap-2 rounded-full bg-teal-500 px-7 py-3 text-sm font-semibold !text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25"
                >
                  Explore {slides[current].label}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>

          {/* ── Right: Carousel (desktop / md+) ── */}
          <div className="hidden md:relative md:flex md:flex-col md:justify-center h-full pt-6 md:pt-0">

            {/* Cards */}
            <div className="relative h-[380px] sm:h-[420px]">
              {slides.map((slide, index) => {
                const pos = visibleIndices.indexOf(index);
                if (pos === -1) return null;

                /* pos: 0 = left/prev, 1 = center/current, 2 = right/next */
                const isCenter = pos === 1;
                const isLeft = pos === 0;

                let translateX = '0%';
                let scale = 1;
                let zIndex = 10;
                let opacity = 1;
                let rotate = '0deg';

                if (isCenter) {
                  translateX = '0%';
                  scale = 1;
                  zIndex = 30;
                  opacity = 1;
                } else if (isLeft) {
                  translateX = '-60%';
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.5;
                  rotate = '-3deg';
                } else {
                  translateX = '60%';
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.5;
                  rotate = '3deg';
                }

                return (
                  <div
                    key={slide.label}
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `translateX(${translateX}) scale(${scale}) rotate(${rotate})`,
                      zIndex,
                      opacity,
                    }}
                    onClick={() => {
                      if (!isCenter) manual(() => goTo(index));
                    }}
                  >
                    <div className={`relative w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl group ${isCenter ? 'ring-2 ring-teal-400/40' : ''}`}>
                      <img width="800" height="600"
                        src={slide.image}
                        alt={`${slide.label} – ${slide.subtitle}`}
                        className={`h-full w-full object-cover transition-transform duration-700 ${isCenter ? 'group-hover:scale-105' : ''}`}
                        loading={index < 3 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-2xl font-bold text-white tracking-wide font-display">
                          {slide.label}
                        </p>
                        <p className="text-xs text-white/60 tracking-wider mt-1 font-medium font-body">{slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-6">


              <button
                onClick={() => manual(prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => manual(() => goTo(i))}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-8 h-2 bg-teal-400'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => manual(next)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            {/* Counter */}
            <p className="text-center text-sm text-white/40 mt-3 font-body tabular-nums">
              {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};