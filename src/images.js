import elephant from '/elephants.jpg';
import arrow from '/arrow.png';
import man1 from "/man1.jpeg";
import man2 from "/man2.jpeg";
import man3 from "/man3.jpeg";
import lady1 from "/lady1.jpeg";
import lady2 from "/lady2.jpeg";
import victoria from "/victoria_falls.jpg";
import egypt from "/egypt.jpg";
import cape_town from "/cape_town.jpg";
import tanzania3 from "/tanzania3.jpg";
import wildbeast from "/wildbeast.jpg";
import mount_kenya from "/mount_kenya.jpg";
import safari from "/safari.jpg";
import kilimanjaro from "/kilimanjaro.jpg";
import sahara from "/sahara.jpg";
import retba from "/retba.jpg";
import maasai from "/maasai_mara.jpg";
import gorilla from "/gorilla.jpg"

export const images = { elephant, arrow }

export const cards = [
    {
        imgUrl: cape_town,
        destination: "south africa",
        title: "cape town",
        desc: "Vibrant coastal city, framed by mountains, beaches, culture, and history."
    },
    {
        imgUrl: victoria,
        destination: "Zambia/Zimbambwe",
        title: "victoria falls",
        desc: "Thundering water cascades dramatically, creating misty rainbows and wonder.",
    },
    {
        imgUrl: egypt,
        destination: "egypt",
        title: "pyramids of giza",
        desc: "Ancient stone monuments rise majestically, preserving Egypt’s mysterious pharaoh legacy.",
    },
    
    {
        imgUrl: elephant,
        destination: "tsavo, Kenya",
        title: "tusks and trunks",
        desc: "Experience the majesty of gentle giants in their natural habitat"
    },
    {
        imgUrl: tanzania3,
        destination: "Tanzania",
        title: "pristine beaches",
        desc: "White sands meet turquoise waters, offering serenity, adventure, and paradise"
    },
    {
        imgUrl: wildbeast,
        destination: "Kenya/Tanzania",
        title: "the great migration",
        desc: "Millions traverse plains, rivers, and predators in nature’s epic journey"
    }

]

export const destinations = [
    {
        imageUrl: safari,
        name: "serengeti park",
        rating: 5
    },
     {
        imageUrl: maasai,
        name: "maasai mara",
        rating: 3
    },
     {
        imageUrl: gorilla,
        name: "mountain gorillas",
        rating: 2
    },
     {
        imageUrl: sahara,
        name: "sahara desert",
        rating: 4
    },
     {
        imageUrl: kilimanjaro,
        name: "mount kilimanjaro",
        rating: 3
    },
     {
        imageUrl: retba,
        name: "lake retba",
        rating: 2
    },
     {
        imageUrl: mount_kenya,
        name: "mount kenya",
        rating: 4
    },
]

export const testimonials = [
    {
        imageUrl: man1,
        name: "Cory Woods",
         rating: 4,
        desc: "Marangi Tours made our trip unforgettable! Everything was perfectly organized, from transport to accommodations. We felt safe, cared for, and free to enjoy every moment."
    },
    {
        imageUrl: man2,
        name: "Joshua Jones",
         rating: 5,
        desc: "Incredible service! Our guide was friendly and knowledgeable, showing us hidden gems we’d never discover alone. Highly recommend Marangi Tours!"
    },
    {
        imageUrl: man3,
        name: "John Kamau",
        rating: 3,
        desc: "Traveling with Marangi Tours was seamless and stress-free. Every detail was handled professionally, and we got to truly experience the culture."
    },
    {
        imageUrl: lady1,
        name: "Haley Bayley",
        rating: 2,
        desc: "Best tour experience ever! Affordable, reliable, and full of adventure. Marangi Tours exceeded our expectations and created lifelong memories."
    },
    {
        imageUrl: lady2,
        name: "Lady Gaga",
        rating: 4,
        desc: "We loved every moment of our safari with Marangi Tours. Great guides, beautiful scenery, and excellent customer care. Will book again!"
    },
    
]