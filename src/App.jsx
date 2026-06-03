import { Home } from "./Home.jsx";
import { Signup } from "./Signup.jsx";
import { Login } from "./Login.jsx";
import { HotelDetails } from "./HotelDetails.jsx";
import { AttractionDetail } from "./AttractionDetail.jsx";
import { BookingCheckout } from "./BookingCheckout.jsx";
import { MyBookings } from "./MyBookings.jsx";
import { SearchResults } from "./SearchResults.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { Settings } from "./Settings.jsx";
import { Navbar } from "./navbar/Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const ProtectedRoute = ({ element, requireAuth = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/attraction/:attractionId" element={<AttractionDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout/:bookingId" element={<ProtectedRoute element={<BookingCheckout />} requireAuth={true} />} />
          <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} requireAuth={true} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} requireAuth={true} />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;

