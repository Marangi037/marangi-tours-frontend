import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const Home = lazy(() => import("./Home.jsx").then(m => ({ default: m.Home })));
const Signup = lazy(() => import("./Signup.jsx").then(m => ({ default: m.Signup })));
const Login = lazy(() => import("./Login.jsx").then(m => ({ default: m.Login })));
const HotelSearchPage = lazy(() => import("./pages/HotelSearchPage.jsx").then(m => ({ default: m.HotelSearchPage })));
const HotelDetailPage = lazy(() => import("./pages/HotelDetailPage.jsx").then(m => ({ default: m.HotelDetailPage })));
const AttractionDetail = lazy(() => import("./AttractionDetail.jsx").then(m => ({ default: m.AttractionDetail })));
const BookingCheckout = lazy(() => import("./BookingCheckout.jsx").then(m => ({ default: m.BookingCheckout })));
const MyBookings = lazy(() => import("./MyBookings.jsx").then(m => ({ default: m.MyBookings })));
const SearchResults = lazy(() => import("./SearchResults.jsx").then(m => ({ default: m.SearchResults })));
const Dashboard = lazy(() => import("./Dashboard.jsx").then(m => ({ default: m.Dashboard })));
const Settings = lazy(() => import("./Settings.jsx").then(m => ({ default: m.Settings })));
const Navbar = lazy(() => import("./navbar/Navbar.jsx").then(m => ({ default: m.Navbar })));
const Footer = lazy(() => import("./Footer.jsx").then(m => ({ default: m.Footer })));
const ScrollToTopButton = lazy(() => import("./components/ScrollToTopButton.jsx").then(m => ({ default: m.ScrollToTopButton })));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx").then(m => ({ default: m.BlogPage })));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.jsx").then(m => ({ default: m.ForgotPasswordPage })));
const VerifyResetCodePage = lazy(() => import("./pages/VerifyResetCodePage.jsx").then(m => ({ default: m.VerifyResetCodePage })));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.jsx").then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage.jsx").then(m => ({ default: m.VerifyEmailPage })));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallbackPage.jsx").then(m => ({ default: m.OAuthCallbackPage })));
const Destination = lazy(() => import("./Destination.jsx").then(m => ({ default: m.Destination })));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx").then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminOverview })));
const AdminBookings = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminBookings })));
const AdminUsers = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminUsers })));
const AdminDestinations = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminDestinations })));
const AdminHotels = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminHotels })));
const AdminBlogs = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminBlogs })));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminTestimonials })));
const AdminContacts = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminContacts })));
const AdminPayments = lazy(() => import("./pages/admin/AdminPages.jsx").then(m => ({ default: m.AdminPayments })));
const NotFound = lazy(() => import("./NotFound.jsx").then(m => ({ default: m.NotFound })));

const ProtectedRoute = ({ element, requireAuth = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ toastMessage: 'Please login to access this page.' }} />;
  }

  return element;
};

function App() {
  const location = useLocation();
  const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-reset-code', '/reset-password', '/verify-email', '/oauth/callback'];
  const hideNavbarAndFooter = authRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (location.hash) {
        setTimeout(() => {
          const id = location.hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const scrollToTop = () => {
          document.documentElement.classList.remove('scroll-smooth');
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';
          window.scrollTo(0, 0);
          setTimeout(() => {
            document.documentElement.classList.add('scroll-smooth');
            document.documentElement.style.scrollBehavior = '';
            document.body.style.scrollBehavior = '';
          }, 50);
        };
        scrollToTop();
        setTimeout(scrollToTop, 100);
      }
    };

    handleScroll();
  }, [location.pathname, location.hash]);

  return (
    <div className="app-shell">
      <Suspense fallback={<div className="h-screen flex justify-center items-center text-teal-400 font-bold tracking-widest text-sm uppercase">Loading...</div>}>
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
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/hotels" element={<HotelSearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route path="/destinations" element={<Destination />} />
            <Route path="/attraction/:attractionId" element={<AttractionDetail />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/checkout/:bookingId" element={<ProtectedRoute element={<BookingCheckout />} requireAuth={true} />} />
            <Route path="/my-bookings" element={<ProtectedRoute element={<MyBookings />} requireAuth={true} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} requireAuth={true} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} requireAuth={false} />}>
              <Route index element={<AdminOverview />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!hideNavbarAndFooter && <Footer />}
        {!hideNavbarAndFooter && <ScrollToTopButton />}
      </Suspense>
    </div>
  );
}

export default App;

