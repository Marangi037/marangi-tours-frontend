import React from 'react'
import { Destination } from "./Destination.jsx";
import { Header } from "./Header.jsx";
import { About } from "./About.jsx";
import { Accomodation } from "./Accomodation.jsx";
import { Testimonials } from "./Testimonials.jsx";
import { Contact } from "./Contact.jsx";
import { Footer } from "./Footer.jsx";

export const Home = () => {
  return (
    <section className="max-w-screen min-w-screen h-full box-border m-0 p-0 ">
        <Header/>
        <Destination/>
        <Accomodation/>
        <About/>
        <Testimonials/>
        <Contact/>
        <Footer/>
    </section>
  )
}
