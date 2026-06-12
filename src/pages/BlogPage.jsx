import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaMapMarkerAlt, FaStar, FaHeart } from 'react-icons/fa';
import { blogPosts } from '../data/blogs';
import { destinationCountries } from '../destinationData';
import { Breadcrumbs } from '../components/Breadcrumbs.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useImageOverrides } from '../context/ImageOverrideContext.jsx';
import { Navbar } from '../navbar/Navbar';
import { Footer } from '../Footer';

export const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { isInWishlist, addToWishlist, removeFromWishlist } = useCart()
  const { getImageUrl } = useImageOverrides()

  const FALLBACK_IMAGE = '/images/photo-1488085061387-422e29b40080.jpg'

  const handleWishlistToggle = (location) => {
    if (isInWishlist(location.id)) {
      removeFromWishlist(location.id)
    } else {
      addToWishlist({ id: location.id, name: location.name, imageUrl: location.imageUrl, city: location.city })
    }
  }

  const post = useMemo(() => blogPosts.find((p) => p.slug === slug), [slug]);

  const relatedAttractions = useMemo(() => {
    if (!post || !post.relatedLocations) return [];
    const attractions = [];
    post.relatedLocations.forEach(locationName => {
      const country = destinationCountries.find(c => c.name.toLowerCase() === locationName.toLowerCase());
      if (country && country.attractions.length > 0) {
        // Just take the first attraction of the country
        const attraction = country.attractions[0];
        attractions.push({
          ...attraction,
          countryName: country.name,
          countryFlag: country.flag
        });
      }
    });
    return attractions;
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-surface-accent flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold text-white mb-6">Post Not Found</h1>
          <button 
            onClick={() => navigate('/#blog')}
            className="px-6 py-3 rounded-full bg-teal-400 text-white font-semibold hover:bg-teal-300 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Realistic blog content generation based on category/title
  const content = (
    <>
      <p>
        The journey begins where the paved roads end. For decades, the allure of {post.relatedLocations[0]} has drawn travelers seeking to witness nature in its rawest form. But beyond the well-trodden paths and popular tourist circuits lies a world completely untamed.
      </p>
      <p className="mt-6">
        When we arrived at the camp, the air was different—crisp, silent, save for the distant calls of wildlife. The guides here don't just know the land; they read it like an ancient manuscript. Every broken twig, every shift in the wind tells a story that has been repeating for millennia.
      </p>
      
      <h2 className="text-2xl font-bold text-teal-400 mt-12 mb-6">Embracing the Unknown</h2>
      <p>
        The true essence of this region reveals itself only to those willing to trade comfort for authenticity. It's in the early morning drives before the sun crests the horizon, wrapped in blankets with a thermos of coffee, waiting for the savanna to wake up.
      </p>

      <blockquote className="my-10 pl-6 border-l-4 border-teal-400 text-2xl font-serif italic text-white/90">
        "To travel here is not just to see a different landscape, but to remember a rhythm of life we have long forgotten."
      </blockquote>

      <p>
        Local conservation efforts have been instrumental in ensuring these pristine environments remain untouched. By venturing into these lesser-known areas, your presence supports the communities that act as the true guardians of this wilderness. The lodges we recommend operate entirely on solar power and blend seamlessly into the environment.
      </p>
      <p className="mt-6">
        Whether you're tracking elusive predators or simply sitting on your veranda watching a thunderstorm roll across the plains, {post.relatedLocations[0]} promises an experience that will fundamentally alter your perspective on the natural world.
      </p>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-accent font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="pt-[100px] pb-4 bg-surface-accent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={[
            { label: 'Blogs', link: '/#blog' },
            { label: post.title }
          ]} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[65vh] min-h-[400px]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-accent via-surface-accent/70 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-teal-400 text-teal-400 text-sm font-bold uppercase tracking-wider bg-teal-400/10 backdrop-blur-sm mb-6">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
            <span>{post.readTime}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>{post.date}</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 w-full">
        <article className="prose prose-invert prose-lg max-w-none text-gray-300">
          {content}
        </article>
      </div>

      {/* Recommended Locations */}
      <div className="bg-[#0f1d35] py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-teal-400 rounded-full" />
            Destinations mentioned in this article
          </h3>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {relatedAttractions.map((location) => (
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
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWishlistToggle(location); }}
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
                    onClick={(e) => { e.preventDefault(); navigate(`/attraction/${location.id}`) }}
                    className='w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]'
                  >
                    View & Book
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
