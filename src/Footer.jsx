import React, { useState } from 'react'
import { FaInstagram, FaWhatsapp, FaPlus, FaMinus } from 'react-icons/fa'
import { FaXTwitter, FaTiktok } from 'react-icons/fa6'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const faqs = [
    { id: 1, question: "What is your cancellation policy?", answer: "Most bookings can be canceled for a full refund up to 48 hours before check-in. Check specific hotel terms during checkout." },
    { id: 2, question: "Do you offer airport transfers?", answer: "Yes, we provide premium airport pickup and drop-off services at all our major destinations. You can request this after booking." },
    { id: 3, question: "Are taxes and fees included?", answer: "Yes! We believe in completely transparent pricing. The total price you see at checkout includes all local taxes and service fees." },
    { id: 4, question: "Can I modify my booking dates?", answer: "You can modify your dates directly from your dashboard up to 7 days before your trip, subject to hotel availability." }
  ]

  const [openFaq, setOpenFaq] = useState(null)

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
          <div className='space-y-6 lg:col-span-2'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white'>
                <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'><path d='M17.5 19c2.48 0 4.5-2.02 4.5-4.5 0-2.3-1.74-4.2-3.95-4.46C17.42 6.55 14.93 4 12 4c-2.4 0-4.48 1.58-5.26 3.79C3.96 8.1 1.5 10.42 1.5 13.5 1.5 16.53 3.97 19 7 19h10.5z'/></svg>
              </div>
              <span className='text-sm font-bold uppercase tracking-widest text-white'>Marangi Tours</span>
            </div>
            <p className='max-w-sm text-sm text-slate-400 leading-relaxed'>
              Crafting unforgettable journeys with luxury, clarity and care. Every itinerary is designed to feel premium and effortless.
            </p>
            <div className='space-y-3 pt-2'>
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

          {/* FAQs */}
          <div className='space-y-4 lg:col-span-2 lg:col-start-4 w-full'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider'>Frequently Asked Questions</h3>
            <div className='space-y-3 w-full'>
              {faqs.map((faq) => (
                <div key={faq.id} className='border-b border-white/10 pb-3'>
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className='flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors'
                  >
                    {faq.question}
                    {openFaq === faq.id ? <FaMinus className='text-teal-400 shrink-0 text-xs' /> : <FaPlus className='text-slate-500 shrink-0 text-xs' />}
                  </button>
                  {openFaq === faq.id && (
                    <p className='mt-2 text-xs text-slate-400 leading-relaxed pr-6'>
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
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