import React from 'react'
import { FaHandHolding, FaHandHoldingUsd, FaCertificate } from 'react-icons/fa';



export const About = () => {
  return (
    <section id='about' className='w-full bg-[#091323] text-white py-24 px-4 lg:px-10'>
      <div className='mx-auto max-w-7xl'>
        <div className='text-center mb-14'>
          <p className='text-sm uppercase tracking-[0.3em] text-[var(--color-secondary)]'>Why Choose</p>
          <h1 className='mt-4 text-4xl lg:text-5xl font-semibold tracking-tight'>
            Marangi Tours
          </h1>
          <p className='mt-4 max-w-2xl mx-auto text-[rgba(247,239,227,0.75)] text-base lg:text-lg leading-8'>
            Enjoy premium tour planning, flexible budgets, and trusted local experiences designed for your next unforgettable journey.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] text-[var(--color-secondary)]'>
              <FaHandHolding className='text-3xl lg:text-4xl' />
            </div>
            <h2 className='mt-8 uppercase text-2xl font-semibold tracking-[0.18em] text-[var(--color-secondary)]'>Trusted</h2>
            <p className='mt-4 text-[rgba(247,239,227,0.78)] text-sm lg:text-base leading-7'>
              Over <strong>1,000</strong> travelers trust us to deliver seamless safaris, luxury stays, and unforgettable local adventures.
            </p>
          </div>

          <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] text-[var(--color-secondary)]'>
              <FaHandHoldingUsd className='text-3xl lg:text-4xl' />
            </div>
            <h2 className='mt-8 uppercase text-2xl font-semibold tracking-[0.18em] text-[var(--color-secondary)]'>Budget Friendly</h2>
            <p className='mt-4 text-[rgba(247,239,227,0.78)] text-sm lg:text-base leading-7'>
              Carefully curated tour packages keep your trip luxurious yet affordable, with transparent pricing and flexible payment options.
            </p>
          </div>

          <div className='rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.06)] p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.35)]'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] text-[var(--color-secondary)]'>
              <FaCertificate className='text-3xl lg:text-4xl' />
            </div>
            <h2 className='mt-8 uppercase text-2xl font-semibold tracking-[0.18em] text-[var(--color-secondary)]'>Certified</h2>
            <p className='mt-4 text-[rgba(247,239,227,0.78)] text-sm lg:text-base leading-7'>
              Fully licensed and locally certified, our agency is recognized for excellence in tourism services across Kenya.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
