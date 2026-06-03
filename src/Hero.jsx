import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Hero = () => {
  const slides = [
    {
      label: 'KENYA',
      subtitle: 'Maasai Mara Safari',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80&auto=format&fit=crop',
    },
    {
      label: 'TANZANIA',
      subtitle: 'Mount Kilimanjaro',
      image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1920&q=80&auto=format&fit=crop',
    },
    {
      label: 'ZANZIBAR',
      subtitle: 'Pristine Beaches',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=80&auto=format&fit=crop',
    },
    {
      label: 'MOMBASA',
      subtitle: 'Coastal Paradise',
      image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1920&q=80&auto=format&fit=crop',
    },
    {
      label: 'SERENGETI',
      subtitle: 'Great Migration',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&q=80&auto=format&fit=crop',
    },
    {
      label: 'CAPE TOWN',
      subtitle: 'Mountain & Ocean',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80&auto=format&fit=crop',
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

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden bg-slate-950 text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

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
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-6 pt-24 pb-8 lg:px-12 font-body justify-center">

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div className="flex flex-col justify-center space-y-5 z-10 max-w-xl">

            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-teal-400" />
              <p className="text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">
                Discover Africa & Beyond
              </p>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight md:leading-[1.08]">
              Your Next
              <span className="block text-teal-400 italic mt-1">Adventure</span>
              <span className="block mt-1">Starts Here</span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-md">
              From the savannahs of Kenya to the shores of Zanzibar — explore hand-picked destinations, curated stays, and unforgettable experiences across the continent.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#destination"
                className="group inline-flex items-center gap-2 rounded-full bg-teal-500 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/25"
              >
                Explore Destinations
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#hotels"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
              >
                View Hotels
              </a>
            </div>
          </div>

          {/* Mobile: 3-item carousel */}
          <div className="md:hidden relative w-full h-[320px] mt-6 flex justify-center items-center overflow-hidden touch-pan-y">
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
                  translateX = -130;
                  scale = 0.85;
                  zIndex = 20;
                  opacity = 0.5;
                  rotate = -3;
                } else {
                  translateX = 130;
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
                      const swipe = offset.x * velocity.x;
                      if (swipe < -1000) {
                        manual(next);
                      } else if (swipe > 1000) {
                        manual(prev);
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      if (!isCenter) manual(() => goTo(index));
                    }}
                  >
                    <div className={`relative w-[210px] h-[280px] rounded-2xl overflow-hidden shadow-2xl group ${isCenter ? 'ring-2 ring-teal-400/40' : ''}`}>
                      <img
                        src={slide.image}
                        alt={`${slide.label} – ${slide.subtitle}`}
                        className="h-full w-full object-cover"
                        loading={index < 3 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-xl font-bold text-white tracking-wide font-display">{slide.label}</p>
                        <p className="text-xs text-white/60 tracking-wider mt-1 font-medium font-body">{slide.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
                      <img
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