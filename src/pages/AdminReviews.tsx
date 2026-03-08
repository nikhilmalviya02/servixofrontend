import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ServicesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BookingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ReviewsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CategoriesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "text-yellow-400 fill-current" : "text-gray-300"}`} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface Review {
  _id: string;
  service: {
    title: string;
  };
  user: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

// Sidebar navigation items
const navItems = [
  { to: "/admin", label: "Dashboard", icon: DashboardIcon },
  { to: "/admin/users", label: "Manage Users", icon: UsersIcon },
  { to: "/admin/services", label: "Manage Services", icon: ServicesIcon },
  { to: "/admin/bookings", label: "Manage Bookings", icon: BookingsIcon },
  { to: "/admin/categories", label: "Categories", icon: CategoriesIcon },
  { to: "/admin/reviews", label: "Reviews", icon: ReviewsIcon },
];

function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://servixobackend.vercel.app/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setDeleteLoading(id);
    try {
      await axios.delete(`https://servixobackend.vercel.app/api/admin/review/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingStats = () => {
    const total = reviews.length;
    const average = total > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total 
      : 0;
    const fiveStar = reviews.filter(r => r.rating === 5).length;
    const fourStar = reviews.filter(r => r.rating === 4).length;
    const threeStar = reviews.filter(r => r.rating === 3).length;
    const twoStar = reviews.filter(r => r.rating === 2).length;
    const oneStar = reviews.filter(r => r.rating === 1).length;
    
    return { total, average: Math.round(average * 10) / 10, fiveStar, fourStar, threeStar, twoStar, oneStar };
  };

  const stats = getRatingStats();

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </div>
    );
  };

  // Sidebar content component
  const SidebarContent = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      <h2 className={`text-xl font-bold mb-6 text-indigo-600 ${mobile ? 'px-2' : ''}`}>
        Admin Panel
      </h2>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.to === "/admin/reviews";
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {mobile && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              onItemClick?.();
              handleLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full hidden md:block flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
        <div className="pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-indigo-600">
              Admin Panel
            </h2>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <CloseIcon />
            </button>
          </div>
          <SidebarContent mobile onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
        {/* Mobile Header with Menu Button */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-white border border-gray-200"
          >
            <MenuIcon />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Reviews</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white border border-gray-200 text-red-600"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Reviews Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Moderate and manage customer reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Total Reviews</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Average Rating</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.average}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">5 Star</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.fiveStar}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">4 Star</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.fourStar}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">3 Star</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.threeStar}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">1-2 Star</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.oneStar + stats.twoStar}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by service, user, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Mobile Reviews Cards */}
        <div className="md:hidden space-y-3 mb-6">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {review.service?.title || "Unknown Service"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteReview(review._id)}
                  disabled={deleteLoading === review._id}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  title="Delete Review"
                >
                  {deleteLoading === review._id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <TrashIcon />
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                  {review.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {review.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {review.user?.email}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                {renderStars(review.rating)}
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {review.comment || "No comment"}
              </p>
            </div>
          ))}
          {filteredReviews.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl">
              {searchTerm ? "No reviews found matching your search" : "No reviews available"}
            </div>
          )}
        </div>

        {/* Desktop Reviews Table */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {review.service?.title || "Unknown Service"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {review.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs line-clamp-2">
                        {review.comment || "No comment"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteReview(review._id)}
                        disabled={deleteLoading === review._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Delete Review"
                      >
                        {deleteLoading === review._id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredReviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "No reviews found matching your search" : "No reviews available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
