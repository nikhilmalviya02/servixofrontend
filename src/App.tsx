import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import PublicRoute from "./utils/PublicRoute";
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
const AdminVerificationPage = lazy(() => import("./pages/AdminVerificationPage"));
const AdminVerificationReview = lazy(() => import("./pages/AdminVerificationReview"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const ProviderVerificationPage = lazy(() => import("./pages/ProviderVerificationPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const CareersPage = lazy(() => import("./pages/CareersPage")); 

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

          {/* Public Landing Page - redirects authenticated users */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Protected User Home/Dashboard */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public Routes - redirect authenticated users */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/services" element={<Services />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/careers" element={<CareersPage />} />

          {/* Provider Profile (Public View) */}
          <Route path="/provider/profile/:id" element={<ProviderProfile />} />

          {/* Provider */}
          <Route
            path="/provider"
            element={
              <RoleBasedRoute allowedRoles={["provider"]}>
                <ProviderDashboard />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/provider/bookings"
            element={
              <RoleBasedRoute allowedRoles={["provider"]}>
                <ProviderBookings />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/provider/verification"
            element={
              <RoleBasedRoute allowedRoles={["provider"]}>
                <ProviderVerificationPage />
              </RoleBasedRoute>
            }
          />

          {/* User */}
          <Route
            path="/user"
            element={
              <RoleBasedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Addresses */}
          <Route
            path="/addresses"
            element={
              <RoleBasedRoute allowedRoles={["user"]}>
                <AddressPage />
              </RoleBasedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminServices />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminBookings />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminReviews />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminCategories />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminUserDetails />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/verifications"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminVerificationPage />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/admin/verification/:userId"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminVerificationReview />
              </RoleBasedRoute>
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