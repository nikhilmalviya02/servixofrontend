import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Suspense, lazy } from "react";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Services = lazy(() => import("./pages/Services"));
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard"));
const ProviderBookings = lazy(() => import("./pages/ProviderBookings"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AddressPage = lazy(() => import("./pages/AddressPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminServices = lazy(() => import("./pages/AdminServices"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminUserDetails = lazy(() => import("./pages/AdminUserDetails"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile")); 

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-indigo-600">404</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Page not found
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 ${isAdminRoute ? '' : 'pt-[64px]'}`}>
      <Suspense fallback={<Loader />}>
        {!isAdminRoute && <Navbar />}

        <Routes>

          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected User Home/Dashboard */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />

          {/* Provider Profile (Public View) */}
          <Route path="/provider/profile/:id" element={<ProviderProfile />} />

          {/* Provider */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/bookings"
            element={
              <ProtectedRoute>
                <ProviderBookings />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Addresses */}
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressPage />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <AdminReviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute>
                <AdminUserDetails />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}

export default App;