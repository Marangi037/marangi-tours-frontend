import React, { useState } from 'react'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaClock } from 'react-icons/fa'

export const Contact = () => {
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 5000)
  }

  const contactCards = [
    { icon: FaPhoneAlt, title: 'Call us', detail: '+254 712 345 678', href: 'tel:+254712345678' },
    { icon: FaEnvelope, title: 'Email', detail: 'hello@marangitours.com', href: 'mailto:hello@marangitours.com' },
    { icon: FaWhatsapp, title: 'WhatsApp', detail: '+254 712 345 678', href: 'https://wa.me/254712345678' },
    { icon: FaClock, title: 'Hours', detail: 'Mon – Sat, 8am – 6pm EAT', href: null },
  ]

  return (
    <section id='contact' className='relative bg-slate-950 py-20 lg:py-28 text-white overflow-hidden'>

      {/* Background texture */}
      <div className='absolute inset-0 opacity-[0.02]' style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className='relative mx-auto max-w-[1400px] px-6 lg:px-12'>

        {/* Two-column layout: Form + Info side by side */}
        <div className='grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start'>

          {/* Left: Header + Form */}
          <div>
            {/* Header */}
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='h-px w-8 bg-teal-400' />
                <p className='text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase'>Get in Touch</p>
              </div>
              <h2 className='text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight'>
                Let's plan your<br />
                <span className='text-slate-400'>perfect journey.</span>
              </h2>
              <p className='mt-4 text-base text-slate-400 leading-relaxed max-w-lg'>
                Our travel experts are ready to help with hotels, curated tours, and bespoke experiences.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className='rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8'
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label htmlFor='firstName' className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>First name</label>
                  <input
                    id='firstName'
                    name='firstName'
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30'
                    placeholder='John'
                    type='text'
                  />
                </div>
                <div>
                  <label htmlFor='lastName' className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>Last name</label>
                  <input
                    id='lastName'
                    name='lastName'
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30'
                    placeholder='Doe'
                    type='text'
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label htmlFor='email' className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>Email</label>
                <input
                  id='email'
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30'
                  placeholder='you@example.com'
                  type='email'
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='phone' className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>Phone</label>
                <input
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30'
                  placeholder='+254 712 345 678'
                  type='tel'
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='message' className='block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider'>Message</label>
                <textarea
                  id='message'
                  name='message'
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 resize-none'
                  placeholder='Tell us about your dream trip...'
                />
              </div>

              <button
                type='submit'
                className='mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]'
              >
                <FaPaperPlane className='text-xs' /> Send Message
              </button>

              {success && (
                <div className='mt-4 rounded-xl bg-teal-500/10 border border-teal-500/20 px-4 py-3 text-sm text-teal-400 flex items-center gap-2'>
                  <svg className='w-4 h-4 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                  Thanks! Your message is on its way — we'll be in touch soon.
                </div>
              )}
            </form>
          </div>

          {/* Right: Contact info cards + offices */}
          <div className='space-y-4 lg:pt-40'>
            {/* Contact cards */}
            {contactCards.map((card) => {
              const Icon = card.icon
              const Wrapper = card.href ? 'a' : 'div'
              const wrapperProps = card.href ? { href: card.href, target: card.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {}

              return (
                <Wrapper
                  key={card.title}
                  {...wrapperProps}
                  className='group flex items-center gap-4 rounded-2xl bg-white/5 border border-white/8 p-5 transition-all duration-300 hover:bg-white/8 hover:border-teal-500/30 hover:-translate-y-0.5'
                >
                  <div className='inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 transition-colors group-hover:bg-teal-500/20'>
                    <Icon className='text-lg' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-white'>{card.title}</p>
                    <p className='mt-0.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors'>{card.detail}</p>
                  </div>
                </Wrapper>
              )
            })}

            {/* Offices */}
            <div className='rounded-2xl bg-white/5 border border-white/8 p-5'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400'>
                  <FaMapMarkerAlt className='text-sm' />
                </div>
                <p className='text-sm font-semibold text-white'>Our Offices</p>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map((city) => (
                  <div key={city} className='rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 text-center'>
                    <p className='text-sm font-medium text-slate-300'>{city}</p>
                    <p className='text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider'>Kenya</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
