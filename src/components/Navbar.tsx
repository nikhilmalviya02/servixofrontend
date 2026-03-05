import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout }: any = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Show Home only for logged out users or customers (user role)
  const showHome = !user || role === "user";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm transition w-full">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          onClick={closeMenu}
        >
          Servixo
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-7 items-center text-gray-700 font-medium">
          {showHome && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition hover:text-indigo-600 ${
                  isActive ? "text-indigo-600 font-semibold" : ""
                }`
              }
            >
              Home
            </NavLink>
          )}

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `transition hover:text-indigo-600 ${
                isActive ? "text-indigo-600 font-semibold" : ""
              }`
            }
          >
            Services
          </NavLink>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "provider" && (
                <>
                  <Link
                    to="/provider"
                    className="hover:text-indigo-600 transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/provider/bookings"
                    className="hover:text-indigo-600 transition"
                  >
                    Bookings
                  </Link>
                </>
              )}

              {role === "user" && (
                <Link
                  to="/user"
                  className="hover:text-indigo-600 transition"
                >
                  My Bookings
                </Link>
              )}

              {role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-indigo-600 transition"
                >
                  Admin
                </Link>
              )}

              {/* Avatar */}
              <div className="flex items-center gap-3 ml-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : role?.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl text-indigo-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-5 pb-5 space-y-3 bg-white/90 backdrop-blur-xl border-t">
          {showHome && (
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          )}
          <Link to="/services" onClick={closeMenu}>
            Services
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "provider" && (
                <>
                  <Link to="/provider" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link to="/provider/bookings" onClick={closeMenu}>
                    Bookings
                  </Link>
                </>
              )}

              {role === "user" && (
                <Link to="/user" onClick={closeMenu}>
                  My Bookings
                </Link>
              )}

              {role === "admin" && (
                <Link to="/admin" onClick={closeMenu}>
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;