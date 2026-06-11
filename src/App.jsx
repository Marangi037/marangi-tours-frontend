import { useEffect } from "react";
import { Home } from "./Home.jsx";
import { Signup } from "./Signup.jsx";
import { Login } from "./Login.jsx";
import { HotelSearchPage } from "./pages/HotelSearchPage.jsx";
import { HotelDetailPage } from "./pages/HotelDetailPage.jsx";
import { AttractionDetail } from "./AttractionDetail.jsx";
import { BookingCheckout } from "./BookingCheckout.jsx";
import { MyBookings } from "./MyBookings.jsx";
import { SearchResults } from "./SearchResults.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { Settings } from "./Settings.jsx";
import { Navbar } from "./navbar/Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { ScrollToTopButton } from "./components/ScrollToTopButton.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { VerifyResetCodePage } from "./pages/VerifyResetCodePage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";
import { VerifyEmailPage } from "./pages/VerifyEmailPage.jsx";
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
  const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-reset-code', '/reset-password', '/verify-email'];
  const hideNavbarAndFooter = authRoutes.includes(location.pathname);

  useEffect(() => {
    const scrollToTop = () => {
      // Remove smooth scrolling classes and inline styles to force instant snap
      document.documentElement.classList.remove('scroll-smooth');
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      
      // Force scroll
      window.scrollTo(0, 0);
      
      // Restore smooth scrolling shortly after
      setTimeout(() => {
        document.documentElement.classList.add('scroll-smooth');
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 50);
    };

    // Scroll immediately
    scrollToTop();
    
    // Also scroll shortly after in case page content (like images/data) pushes the height down
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {!hideNavbarAndFooter && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/hotels" element={<HotelSearchPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/attraction/:attractionId" element={<AttractionDetail />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout/:bookingId" element={<ProtectedRoute element={<BookingCheckout />} requireAuth={true} />} />
          <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} requireAuth={true} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} requireAuth={true} />} />
        </Routes>
      </main>
      {!hideNavbarAndFooter && <Footer />}
      {!hideNavbarAndFooter && <ScrollToTopButton />}
    </div>
  );
}

export default App;

