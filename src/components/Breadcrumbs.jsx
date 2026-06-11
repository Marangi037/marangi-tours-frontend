import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ crumbs, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap scrollbar-hide ${className}`}>
      <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
      {crumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          {crumb.link ? (
            <Link to={crumb.link} className="hover:text-teal-400 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-teal-400">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
