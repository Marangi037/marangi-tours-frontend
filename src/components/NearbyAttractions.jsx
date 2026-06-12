import React from 'react';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MOCK_ATTRACTIONS = [
  { id: '1', name: 'Nairobi National Park', category: 'Nature', distance: '3.2', image: '/images/photo-1547471080-7cc2caa01a7e.jpg' },
  { id: '2', name: 'Giraffe Centre', category: 'Wildlife', distance: '5.8', image: '/images/photo-1590523277543-a94d2e4eb00b.jpg' },
  { id: '3', name: 'Karen Blixen Museum', category: 'Culture', distance: '7.1', image: '/images/photo-1580060839134-75a5edca2e99.jpg' },
  { id: '4', name: 'Bomas of Kenya', category: 'Culture', distance: '8.5', image: '/images/photo-1516026672322-bc52d61a55d5.jpg' },
];

export const NearbyAttractions = ({ city = 'the city' }) => {
  return (
    <div className="w-full mt-16 font-inter">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white font-playfair italic">
          Explore Near {city}
        </h3>
        <Link to={`/destinations`} className="hidden md:flex items-center gap-2 text-teal-400 text-sm font-semibold hover:text-teal-300 transition-colors">
          View All Destinations <FaArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-5 snap-x snap-mandatory no-scrollbar pb-6">
        {MOCK_ATTRACTIONS.map((attraction) => (
          <Link 
            key={attraction.id} 
            to={`/attraction/${attraction.id}`}
            className="shrink-0 w-[280px] md:w-[320px] rounded-2xl bg-surface-card border border-white/8 overflow-hidden snap-start hover:border-teal-400/30 hover:shadow-lg hover:-translate-y-1 transition-all group block"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={attraction.image} 
                alt={attraction.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-surface-darker/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                {attraction.category}
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-white font-bold text-base mb-2 line-clamp-1 group-hover:text-teal-400 transition-colors">
                {attraction.name}
              </h4>
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                <FaMapMarkerAlt /> 
                <span>{attraction.distance} km from hotel</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-2 md:hidden">
        <Link to={`/destinations`} className="flex items-center justify-center gap-2 text-teal-400 text-sm font-semibold hover:text-teal-300 transition-colors w-full py-3 bg-white/5 rounded-xl">
          View All Destinations <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
};
