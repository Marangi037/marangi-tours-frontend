import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { FaXTwitter, FaTiktok } from 'react-icons/fa6'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Destinations', href: '#destination' },
    { label: 'Hotels', href: '#hotels' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ]

  const popularDestinations = [
    { label: 'Maasai Mara', href: '#destination' },
    { label: 'Zanzibar', href: '#destination' },
    { label: 'Serengeti', href: '#destination' },
    { label: 'Cape Town', href: '#destination' },
    { label: 'Mount Kilimanjaro', href: '#destination' },
  ]

  const socialLinks = [
    { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaWhatsapp, href: 'https://wa.me/254712345678', label: 'WhatsApp' },
    { icon: FaXTwitter, href: 'https://x.com', label: 'X (Twitter)' },
  ]

  const handleScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.getElementById(href.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className='bg-slate-950 border-t border-white/5'>
      <div className='mx-auto max-w-[1400px] px-6 lg:px-12 py-16'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-5'>

          {/* Brand */}
          <div className='space-y-5 lg:col-span-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white'>
                <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'><path d='M17.5 19c2.48 0 4.5-2.02 4.5-4.5 0-2.3-1.74-4.2-3.95-4.46C17.42 6.55 14.93 4 12 4c-2.4 0-4.48 1.58-5.26 3.79C3.96 8.1 1.5 10.42 1.5 13.5 1.5 16.53 3.97 19 7 19h10.5z'/></svg>
              </div>
              <span className='text-sm font-bold uppercase tracking-widest text-white'>Marangi Tours</span>
            </div>
            <p className='max-w-sm text-sm text-slate-400 leading-relaxed'>
              Crafting unforgettable journeys with luxury, clarity and care. Every itinerary is designed to feel premium and effortless.
            </p>
            <div className='flex items-center gap-4 pt-1'>
              <a
                href='#destination'
                onClick={(e) => handleScroll(e, '#destination')}
                className='rounded-full bg-teal-500 px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wider transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20'
              >
                Explore
              </a>
              <a
                href='#hotels'
                onClick={(e) => handleScroll(e, '#hotels')}
                className='rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wider transition-all hover:bg-white/10 hover:border-white/25'
              >
                Hotels
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>Navigate</h3>
            <ul className='space-y-2.5'>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className='text-sm text-slate-400 hover:text-teal-400 transition-colors'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>Popular</h3>
            <ul className='space-y-2.5'>
              {popularDestinations.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className='text-sm text-slate-400 hover:text-teal-400 transition-colors'
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>Contact</h3>
            <div className='space-y-2.5'>
              <a href='tel:+254712345678' className='block text-sm text-slate-400 hover:text-teal-400 transition-colors'>
                +254 712 345 678
              </a>
              <a href='mailto:hello@marangitours.com' className='block text-sm text-slate-400 hover:text-teal-400 transition-colors'>
                hello@marangitours.com
              </a>
            </div>
            <div className='flex items-center gap-3 pt-2'>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.label}
                    className='flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-slate-400 transition-all hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30'
                  >
                    <Icon className='text-sm' />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-white/5 py-6'>
        <div className='mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='text-xs text-slate-500'>
            © {currentYear} Marangi Tours. All rights reserved.
          </p>
          <div className='flex items-center gap-4'>
            <a href='#' className='text-xs text-slate-500 hover:text-slate-300 transition-colors'>Privacy</a>
            <a href='#' className='text-xs text-slate-500 hover:text-slate-300 transition-colors'>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}