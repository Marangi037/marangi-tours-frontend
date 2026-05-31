import { Home } from "./Home.jsx";
import { Signup } from "./SignupNew.jsx";
import { Login } from "./Login.jsx";
import { HotelDetails } from "./HotelDetails.jsx";
import { BookingCheckout } from "./BookingCheckout.jsx";
import { MyBookings } from "./MyBookings.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Protected route wrapper
const ProtectedRoute = ({ element, requireAuth = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/hotel/:id" element={<HotelDetails />} />
      <Route path="/checkout/:bookingId" element={<ProtectedRoute element={<BookingCheckout />} requireAuth={true} />} />
      <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} requireAuth={true} />} />
    </Routes>
  );
}

export default App;
