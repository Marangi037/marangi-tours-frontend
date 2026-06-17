import React from 'react'
import { Destination } from "../pages/DestinationPage.jsx";
import { Hero } from "../components/Hero.jsx";
import { About } from "../components/About.jsx";
import { Accomodation } from "../components/Accomodation.jsx";
import { Testimonials } from "../components/Testimonials.jsx";
import { Contact } from "../components/Contact.jsx";
import { BlogSection } from "../components/BlogSection.jsx";
export const Home = () => {
  return (
    <section className="w-full h-full box-border m-0 p-0 overflow-x-hidden">
      <Hero />
      <Destination isHomeSection={true} />
      <Accomodation />
      <About />
      <Testimonials />
      <BlogSection />
      <Contact />
    </section>
  )
}
