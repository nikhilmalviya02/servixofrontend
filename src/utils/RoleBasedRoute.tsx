import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RoleBasedRoute({ children, allowedRoles }: any) {
  const { user, loading }: any = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = localStorage.getItem("role");
  
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "provider") return <Navigate to="/provider" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default RoleBasedRoute;
