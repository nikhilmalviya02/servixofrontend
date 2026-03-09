import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, Grid3X3, LayoutDashboard, CalendarDays, UserCircle, LogOut, Menu, X, Sparkles } from "lucide-react";

function Navbar() {
  const { user, logout }: any = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const showHome = !user || role === "user";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-600 font-semibold"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container-modern">
        <div className="flex justify-between items-center h-16">
          {/* Brand Name */}
          <Link
            to={user ? "/home" : "/"}
            className="text-2xl font-bold text-indigo-600"
            onClick={closeMenu}
          >
            ServexaGo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {showHome && (
              <NavLink to={user ? "/home" : "/"} className={navLinkClass}>
                <Home className="w-4 h-4" />
                Home
              </NavLink>
            )}

            <NavLink to={user ? "/services" : "/login"} className={navLinkClass}>
              <Grid3X3 className="w-4 h-4" />
              Services
            </NavLink>

            {!user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-600 font-medium hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                {role === "provider" && (
                  <>
                    <NavLink to="/provider" className={navLinkClass}>
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </NavLink>
                    <NavLink to="/provider/bookings" className={navLinkClass}>
                      <CalendarDays className="w-4 h-4" />
                      Bookings
                    </NavLink>
                  </>
                )}

                {role === "user" && (
                  <NavLink to="/user" className={navLinkClass}>
                    <CalendarDays className="w-4 h-4" />
                    My Bookings
                  </NavLink>
                )}

                {role === "admin" && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </NavLink>
                )}

                {/* User Avatar */}
                <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : role?.charAt(0).toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="container-modern py-4 space-y-2">
            {showHome && (
              <Link
                to={user ? "/home" : "/"}
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            )}
            
            <Link
              to={user ? "/services" : "/login"}
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
            >
              <Grid3X3 className="w-5 h-5" />
              Services
            </Link>

            {!user ? (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <UserCircle className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {role === "provider" && (
                  <>
                    <Link
                      to="/provider"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/provider/bookings"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                    >
                      <CalendarDays className="w-5 h-5" />
                      Bookings
                    </Link>
                  </>
                )}

                {role === "user" && (
                  <Link
                    to="/user"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                  >
                    <CalendarDays className="w-5 h-5" />
                    My Bookings
                  </Link>
                )}

                {role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
