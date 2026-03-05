import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AddService from "../components/AddService";
import { useAuth } from "../context/AuthContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

interface Booking {
  _id: string;
  service: { title: string };
  user: { name: string };
  status: string;
  date: string;
  isEmergency: boolean;
}

function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch provider's services
      const servicesRes = await axios.get(
        "https://servixobackend.vercel.app/api/services",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Filter services by current provider
      const myServices = servicesRes.data.filter(
        (s: any) => s.provider?._id === user?.id || s.provider === user?.id
      );
      setServices(myServices);

      // Fetch provider's bookings
      const bookingsRes = await axios.get(
        "https://servixobackend.vercel.app/api/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(bookingsRes.data.slice(0, 5)); // Get only 5 recent bookings
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const stats = useMemo(() => {
    return {
      totalServices: services.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      completedBookings: bookings.filter((b) => b.status === "completed").length,
      averageRating:
        services.length > 0
          ? (
              services.reduce((acc, s) => acc + (s.averageRating || 0), 0) /
              services.length
            ).toFixed(1)
          : "0.0",
    };
  }, [services, bookings]);

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`https://servixobackend.vercel.app/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black p-6 pt-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Provider Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your services and grow your business.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/provider/bookings"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02] transition"
            >
              View All Bookings
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard
            title="Services"
            value={stats.totalServices}
            icon="🛠️"
            color="indigo"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon="📋"
            color="blue"
          />
          <StatCard
            title="Pending"
            value={stats.pendingBookings}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title="Completed"
            value={stats.completedBookings}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Avg Rating"
            value={stats.averageRating}
            icon="⭐"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services & Add Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Service Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Add New Service
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Expand your offerings
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                >
                  {showAddForm ? "Hide Form" : "Show Form"}
                </button>
              </div>

              {showAddForm && (
                <AddService
                  compact
                  onServiceAdded={() => {
                    fetchData();
                    setShowAddForm(false);
                  }}
                />
              )}
            </div>

            {/* My Services Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    My Services
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage your service listings
                  </p>
                </div>
                <Link
                  to="/services"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Browse All Services →
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">🛠️</p>
                  <p>No services yet. Add your first service above!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {services.slice(0, 4).map((service) => (
                    <div
                      key={service._id}
                      className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          {service.title}
                        </h3>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          ₹{service.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {service.averageRating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="text-gray-400 text-xs">
                            ({service.totalReviews || 0})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="mt-3 text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Bookings with Actions */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-lg transition">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Bookings
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Accept, reject or complete bookings
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">📋</p>
                  <p>No bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className={`border rounded-xl p-4 transition ${
                        booking.isEmergency
                          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                          {booking.service?.title}
                        </h3>
                        {booking.isEmergency && (
                          <span className="text-xs text-red-500 font-medium">
                            ⚡ Emergency
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Customer: {booking.user?.name}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking._id, "accepted")}
                            className="flex-1 py-1.5 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, "rejected")}
                            className="flex-1 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {booking.status === "accepted" && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, "completed")}
                          className="w-full py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/provider/bookings"
                className="mt-6 block text-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                View All Bookings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    indigo:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    yellow:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-sm ${colors[color]} transition hover:scale-[1.02]`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default ProviderDashboard;