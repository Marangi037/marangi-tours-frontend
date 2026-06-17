import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

import { FaArrowUp, FaArrowDown, FaEllipsisH } from 'react-icons/fa';

// Reusable Table Component (Updated for new theme)
const DataTable = ({ columns, data }) => (
  <div className="overflow-x-auto w-full">
    <table className="w-full text-left text-sm text-[var(--admin-text-main)]">
      <thead className="text-[var(--admin-text-muted)] font-medium border-b border-[var(--admin-border)]">
        <tr>
          {columns.map((col, idx) => <th key={idx} className="px-6 py-4">{col.header}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--admin-border)]">
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} className="px-6 py-8 text-center text-[var(--admin-text-muted)]">No data found.</td></tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-[var(--admin-bg)] transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);



export const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    adminService.getStats().then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-[var(--admin-accent)] text-3xl" /></div>;

  return (
    <div className="h-full lg:h-[calc(100vh-4rem)] flex flex-col">
      
      {/* CSS Grid for the NeuroBank layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column (Span 1) */}
        <div className="flex flex-col gap-6 h-full">
          {/* AI Insights / Highlight Card */}
          <div className="admin-card overflow-hidden relative p-6 h-64 lg:h-[40%] min-h-[16rem] flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-accent-hover) 100%)', color: 'white' }}>
            <div className="flex justify-between items-center">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">This Month</span>
              <FaEllipsisH className="text-white/70 cursor-pointer" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Travel Insights</p>
              <h3 className="text-2xl font-bold leading-tight">You have {stats.destinationsCount} destinations and {stats.hotelsCount} active hotels ready to be booked.</h3>
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Transactions / Recent Bookings */}
          <div className="admin-card p-6 h-[400px] lg:h-[60%] lg:flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Bookings</h3>
              <div className="w-8 h-8 rounded-full border border-[var(--admin-border)] flex items-center justify-center cursor-pointer text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]">
                <FaEllipsisH className="text-xs" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {stats.recentBookings.map((booking, i) => (
                <div key={booking._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--admin-bg)] flex items-center justify-center font-bold text-[var(--admin-text-main)]">
                      {booking.user ? booking.user.firstName.charAt(0) : 'G'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Guest'}</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${booking.totalPrice}</p>
                    <p className={`text-[10px] font-bold ${booking.status === 'confirmed' ? 'text-[var(--admin-success)]' : 'text-[var(--admin-danger)]'}`}>{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          
          {/* Top Row: Balance & Earnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto lg:h-[40%] lg:min-h-[16rem]">
            
            {/* Balance Overview (Revenue) */}
            <div className="admin-card p-6 h-64 lg:h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--admin-text-muted)] mb-1">Total Revenue</p>
                  <div className="flex items-end gap-2">
                    <h2 className="text-3xl font-bold">${stats.totalRevenue}</h2>
                    {stats.revenueTrend !== null && stats.revenueTrend !== undefined && (
                      <span className={`flex items-center text-xs font-bold mb-1 ${stats.revenueTrend >= 0 ? 'text-[var(--admin-success)]' : 'text-[var(--admin-danger)]'}`}>
                        {stats.revenueTrend >= 0 ? <FaArrowUp className="mr-1"/> : <FaArrowDown className="mr-1"/>}
                        {Math.abs(stats.revenueTrend)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-[var(--admin-border)] flex items-center justify-center cursor-pointer text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]">
                  <FaEllipsisH className="text-xs" />
                </div>
              </div>
              {/* CSS Line Chart Approximation */}
              <div className="mt-auto h-24 relative overflow-hidden flex items-end">
                <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                  <path d="M0,40 L0,30 C20,30 30,10 50,20 C70,30 80,5 100,10 L100,40 Z" fill="var(--admin-accent)" fillOpacity="0.1" />
                  <path d="M0,30 C20,30 30,10 50,20 C70,30 80,5 100,10" fill="none" stroke="var(--admin-accent)" strokeWidth="2" />
                  <circle cx="80" cy="5" r="2" fill="var(--admin-accent)" />
                </svg>
              </div>
            </div>

            {/* Earnings (Total Bookings) */}
            <div className="admin-card p-6 h-64 lg:h-full flex flex-col items-center relative">
              <div className="w-full flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-[var(--admin-text-muted)]">Total Bookings</p>
                <FaEllipsisH className="text-[var(--admin-text-muted)] cursor-pointer" />
              </div>
              <h2 className="text-2xl font-bold w-full text-left mb-6">{stats.bookingsCount} <span className="text-xs text-[var(--admin-success)]">↑ 7%</span></h2>
              
              {/* CSS Radial Chart Approximation */}
              <div className="relative w-32 h-16 overflow-hidden mt-auto">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-[var(--admin-border)] border-b-transparent border-r-transparent transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-[var(--admin-accent)] border-b-transparent border-r-transparent transform -rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}></div>
                <div className="absolute bottom-0 left-0 w-full text-center">
                  <p className="text-[10px] text-[var(--admin-text-muted)] font-bold uppercase tracking-widest">Active</p>
                  <p className="text-xl font-bold text-[var(--admin-text-main)] leading-none">85%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Spending (Users) */}
          <div className="admin-card p-6 h-[400px] lg:h-[60%] lg:flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[var(--admin-text-muted)] mb-1">Registered Users</p>
                <div className="flex items-end gap-2">
                  <h2 className="text-3xl font-bold">{stats.usersCount}</h2>
                  <span className="flex items-center text-xs font-bold text-[var(--admin-success)] mb-1"><FaArrowUp className="mr-1"/> 2%</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-[var(--admin-border)] flex items-center justify-center cursor-pointer text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]">
                <FaEllipsisH className="text-xs" />
              </div>
            </div>
            
            {/* CSS Bar Chart Approximation */}
            <div className="flex-1 mt-8 flex items-end justify-between px-2 gap-2 md:gap-4">
              {[40, 70, 45, 90, 60, 30, 80].map((h, idx) => (
                <div key={idx} className="w-full flex flex-col items-center gap-2 group">
                  <div className="w-full bg-[var(--admin-bg)] rounded-t-md relative overflow-hidden" style={{height: '180px'}}>
                    <div className="absolute bottom-0 left-0 w-full bg-[var(--admin-accent)] opacity-80 group-hover:opacity-100 transition-opacity rounded-t-md" style={{height: `${h}%`}}></div>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--admin-text-muted)]">Day {idx+1}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export const AdminBookings = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getBookings().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">All Bookings</h1>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Booking ID', render: r => r._id.substring(0,8) },
            { header: 'User', render: r => r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Guest' },
            { header: 'Item', render: r => r.hotel ? r.hotel.name : 'Premium Booking' },
            { header: 'Date', render: r => new Date(r.createdAt).toLocaleDateString() },
            { header: 'Total', render: r => <span className="font-bold">${r.totalPrice}</span> },
            { header: 'Status', render: r => <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'confirmed' ? 'bg-[var(--admin-success)] bg-opacity-20 text-[var(--admin-success)]' : 'bg-amber-500/20 text-amber-500'}`}>{r.status}</span>}
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminUsers = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getUsers().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Registered Users</h1>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Name', render: r => <span className="font-bold">{r.firstName} {r.lastName}</span> },
            { header: 'Email', accessor: 'email' },
            { header: 'Role', render: r => <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.role === 'admin' ? 'bg-[var(--admin-accent)] bg-opacity-20 text-[var(--admin-accent)]' : 'bg-[var(--admin-border)] text-[var(--admin-text-muted)]'}`}>{r.role}</span> },
            { header: 'Joined', render: r => new Date(r.createdAt).toLocaleDateString() }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminDestinations = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getDestinations().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Destinations</h1>
        <button className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all">
          <FaPlus /> Add Destination
        </button>
      </div>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Name', render: r => <span className="font-bold">{r.name}</span> },
            { header: 'Country', accessor: 'country' },
            { header: 'Continent', accessor: 'continent' },
            { header: 'Status', render: r => r.isActive ? <FaCheck className="text-[var(--admin-success)]"/> : <FaTimes className="text-[var(--admin-danger)]"/> }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminHotels = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getHotels().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Hotels</h1>
        <button className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all">
          <FaPlus /> Add Hotel
        </button>
      </div>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Name', render: r => <span className="font-bold">{r.name}</span> },
            { header: 'City', accessor: 'city' },
            { header: 'Country', accessor: 'country' },
            { header: 'Price/Night', render: r => <span className="font-bold">${r.pricePerNight}</span> }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminBlogs = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getBlogs().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Blogs</h1>
        <button className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all">
          <FaPlus /> Add Blog
        </button>
      </div>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Title', render: r => <span className="font-bold">{r.title}</span> },
            { header: 'Author', accessor: 'author' },
            { header: 'Category', accessor: 'category' },
            { header: 'Status', render: r => <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === 'published' ? 'bg-[var(--admin-success)] bg-opacity-20 text-[var(--admin-success)]' : 'bg-[var(--admin-border)] text-[var(--admin-text-muted)]'}`}>{r.status}</span> }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminTestimonials = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getTestimonials().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Testimonials</h1>
        <button className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md transition-all">
          <FaPlus /> Add Testimonial
        </button>
      </div>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Name', render: r => <span className="font-bold">{r.name}</span> },
            { header: 'Rating', render: r => <span className="text-yellow-500 font-bold">{r.rating} / 5</span> },
            { header: 'Snippet', render: r => r.desc ? r.desc.substring(0, 50) + '...' : '' },
            { header: 'Status', render: r => r.isActive ? <FaCheck className="text-[var(--admin-success)]"/> : <FaTimes className="text-[var(--admin-danger)]"/> }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminContacts = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getContacts().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Contact Messages</h1>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Name', render: r => <span className="font-bold">{r.name}</span> },
            { header: 'Email', accessor: 'email' },
            { header: 'Message', render: r => r.message ? r.message.substring(0, 50) + '...' : '' },
            { header: 'Date', render: r => new Date(r.createdAt).toLocaleDateString() }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};

export const AdminPayments = () => {
  const [data, setData] = useState([]);
  useEffect(() => { adminService.getPayments().then(res => setData(res.data)).catch(console.error); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--admin-text-main)]">Payment Logs</h1>
      <div className="admin-card p-6">
        <DataTable 
          columns={[
            { header: 'Gateway', render: r => <span className="uppercase text-xs font-bold text-[var(--admin-accent)]">{r.gateway}</span> },
            { header: 'Event', accessor: 'eventType' },
            { header: 'Booking ID', render: r => r.bookingId ? r.bookingId.substring(0,8) : 'N/A' },
            { header: 'Date', render: r => new Date(r.createdAt).toLocaleString() }
          ]}
          data={data}
        />
      </div>
    </div>
  );
};
