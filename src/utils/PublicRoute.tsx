import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }: any) {
  const { user, loading }: any = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    // Check if there's a saved redirect location
    if (location.state?.from) {
      return <Navigate to={location.state.from} replace />;
    }
    
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'provider':
        return <Navigate to="/provider" replace />;
      case 'user':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return children;
}

export default PublicRoute;
