import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '../data/blogs';

export const BlogSection = () => {
  const navigate = useNavigate();

  return (
    <section id="blog" className="relative w-full bg-surface-accent py-16 lg:py-24 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">
              From the Journal
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stories from the <br className="hidden sm:block" />
            <span className="text-teal-400 italic font-medium">road less taken.</span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div 
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/10"
            >
              {/* Background Image */}
              <img 
                src={post.image} 
                alt={post.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-accent via-surface-accent/60 to-transparent opacity-90" />

              {/* Diagonal Arrow Button */}
              <button 
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl bg-teal-400 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-300 shadow-lg"
                aria-label="Read article"
              >
                <ArrowUpRight className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full border border-teal-400 text-teal-400 text-xs font-bold uppercase tracking-wider bg-teal-400/10 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-lg sm:text-xl line-clamp-2 mb-3 leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 text-sm line-clamp-3 mb-5 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span>{post.readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
