import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBookOpen, FaUsers, FaMapMarkedAlt, FaHotel, FaPenNib, FaQuoteLeft, FaEnvelope, FaMoneyBillWave, FaSignOutAlt, FaHome, FaSun, FaMoon } from 'react-icons/fa';

export const AdminSidebar = ({ onLogout, isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt />, exact: true },
    { name: 'Accounts', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FaBookOpen /> },
    { name: 'Destinations', path: '/admin/destinations', icon: <FaMapMarkedAlt /> },
    { name: 'Hotels', path: '/admin/hotels', icon: <FaHotel /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FaPenNib /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <FaQuoteLeft /> },
    { name: 'Messages', path: '/admin/contacts', icon: <FaEnvelope /> },
    { name: 'Payments', path: '/admin/payments', icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="w-64 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)] h-screen sticky top-0 flex flex-col pt-6 transition-colors shadow-xl z-20">
      
      {/* Profile & Theme Toggle */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)] flex items-center justify-center text-white font-bold shadow-lg">M</div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--admin-text-muted)] tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h2 className="text-sm font-bold text-[var(--admin-text-main)] leading-tight">Welcome back,<br/>Admin!</h2>
          </div>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-8 h-8 rounded-full bg-[var(--admin-bg)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-all"
        >
          {isDarkMode ? <FaSun className="text-xs" /> : <FaMoon className="text-xs" />}
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.exact}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? 'bg-[var(--admin-bg)] text-[var(--admin-text-main)] font-bold shadow-sm active-navlink'
                  : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] hover:bg-[var(--admin-bg)]'
              }`
            }
          >
            <span className="group-[.active-navlink]:text-[var(--admin-accent)] text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--admin-border)] space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text-main)] hover:bg-[var(--admin-bg)] transition-all font-medium text-sm"
        >
          <FaHome /> Go to Home
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-[var(--admin-danger)] hover:bg-[var(--admin-danger)] hover:bg-opacity-10 transition-all font-medium text-sm"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};
