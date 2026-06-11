import React from 'react'
import { Destination } from "./Destination.jsx";
import { Hero } from "./Hero.jsx";
import { About } from "./About.jsx";
import { Accomodation } from "./Accomodation.jsx";
import { Testimonials } from "./Testimonials.jsx";
import { Contact } from "./Contact.jsx";
import { BlogSection } from "./components/BlogSection.jsx";
export const Home = () => {
  return (
    <section className="w-full h-full box-border m-0 p-0 overflow-x-hidden">
      <Hero />
      <Destination />
      <Accomodation />
      <About />
      <Testimonials />
      <BlogSection />
      <Contact />
    </section>
  )
}
