import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AddService from "../components/AddService";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  CalendarDays,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
  Search,
  ChevronRight,
  BarChart3,
  Users,
  Zap
} from "lucide-react";

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
  service: { title: string; price?: number };
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
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const totalEarnings = completedBookings.reduce(
      (acc, b) => acc + (b.service?.price || 0),
      0
    );
    
    return {
      totalServices: services.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      acceptedBookings: bookings.filter((b) => b.status === "accepted").length,
      completedBookings: completedBookings.length,
      rejectedBookings: bookings.filter((b) => b.status === "rejected").length,
      averageRating:
        services.length > 0
          ? (
              services.reduce((acc, s) => acc + (s.averageRating || 0), 0) /
              services.length
            ).toFixed(1)
          : "0.0",
      totalEarnings,
      conversionRate: bookings.length > 0 
        ? Math.round((completedBookings.length / bookings.length) * 100) 
        : 0,
    };
  }, [services, bookings]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Provider Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage services, track performance, and handle bookings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition border border-indigo-600"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Cancel" : "Add Service"}
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard
            title="Total Earnings"
            value={`₹${stats.totalEarnings.toLocaleString()}`}
            icon={TrendingUp}
            trend="+12%"
            trendUp={true}
            color="green"
          />
          <AnalyticsCard
            title="Active Services"
            value={stats.totalServices}
            icon={Briefcase}
            color="indigo"
          />
          <AnalyticsCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={BarChart3}
            trend="+5%"
            trendUp={true}
            color="blue"
          />
          <AnalyticsCard
            title="Avg Rating"
            value={stats.averageRating}
            icon={Star}
            color="yellow"
          />
        </div>

        {/* Add Service Form */}
        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Service
                </h2>
                <p className="text-sm text-gray-400">
                  Create a new service offering for customers
                </p>
              </div>
            </div>
            <AddService
              compact
              onServiceAdded={() => {
                fetchData();
                setShowAddForm(false);
              }}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Services Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Services Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      My Services
                    </h2>
                    <p className="text-sm text-gray-400">
                      Manage your service listings
                    </p>
                  </div>
                </div>
                <Link
                  to="/services"
                  className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Browse
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No services yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add your first service to start receiving bookings
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition border border-indigo-600"
                  >
                    Add Service
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors bg-white"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {service.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-gray-600">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-indigo-600">
                          ₹{service.price}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{service.averageRating?.toFixed(1) || "0.0"}</span>
                          <span className="text-gray-400">({service.totalReviews || 0})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Management Table */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Booking Requests
                    </h2>
                    <p className="text-sm text-gray-400">
                      Manage and respond to customer bookings
                    </p>
                  </div>
                </div>
                <Link
                  to="/provider/bookings"
                  className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 px-4 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
                >
                  View All Bookings
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl">
                  <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No bookings found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery || filterStatus !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Bookings will appear here when customers request your services"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.slice(0, 6).map((booking) => (
                    <div
                      key={booking._id}
                      className={`flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-xl ${
                        booking.isEmergency
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          booking.isEmergency ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          {booking.isEmergency ? (
                            <Zap className="w-5 h-5 text-red-600" />
                          ) : (
                            <CalendarDays className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800 truncate">
                              {booking.service?.title}
                            </h3>
                            {booking.isEmergency && (
                              <span className="text-xs text-red-600 font-medium px-2 py-0.5 bg-red-100 border border-red-200 rounded-full">
                                Emergency
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {booking.user?.name} • {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                        
                        {/* Action Buttons */}
                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateBookingStatus(booking._id, "accepted")}
                              className="p-2 text-green-600 hover:bg-green-50 border border-green-200 rounded-lg transition"
                              title="Accept"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "rejected")}
                              className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {booking.status === "accepted" && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, "completed")}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Status Overview */}
          <div className="space-y-6">
            {/* Status Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Booking Status
                  </h2>
                  <p className="text-sm text-gray-400">
                    Overview of all bookings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <StatusRow 
                  label="Pending"
                  count={stats.pendingBookings}
                  total={stats.totalBookings}
                  color="yellow"
                  icon={Clock}
                />
                <StatusRow 
                  label="Accepted"
                  count={stats.acceptedBookings}
                  total={stats.totalBookings}
                  color="blue"
                  icon={CheckCircle}
                />
                <StatusRow 
                  label="Completed"
                  count={stats.completedBookings}
                  total={stats.totalBookings}
                  color="green"
                  icon={CheckCircle}
                />
                <StatusRow 
                  label="Rejected"
                  count={stats.rejectedBookings}
                  total={stats.totalBookings}
                  color="red"
                  icon={XCircle}
                />
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Pro Tips
                </h2>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>Respond to bookings within 24 hours for better ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>Mark completed jobs promptly to track earnings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>Add detailed service descriptions to attract more customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>Emergency bookings often lead to repeat customers</span>
                </li>
              </ul>
            </div>

            {/* Performance Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Performance
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Response Rate</span>
                    <span className="font-medium text-gray-800">92%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Completion Rate</span>
                    <span className="font-medium text-gray-800">{stats.conversionRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.conversionRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Customer Satisfaction</span>
                    <span className="font-medium text-gray-800">{stats.averageRating}/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${(parseFloat(stats.averageRating as string) / 5) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
}) {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
    green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600" },
    red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600" },
  };

  const colorStyle = colors[color];

  return (
    <div className={`p-5 rounded-xl border ${colorStyle.bg} ${colorStyle.border}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center border ${colorStyle.border}`}>
          <Icon className={`w-5 h-5 ${colorStyle.icon}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-3">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

function StatusRow({
  label,
  count,
  total,
  color,
  icon: Icon,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ElementType;
}) {
  const colors: Record<string, { bg: string; border: string; icon: string; bar: string }> = {
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-600", bar: "bg-yellow-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", bar: "bg-blue-500" },
    green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", bar: "bg-green-500" },
    red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", bar: "bg-red-500" },
  };

  const colorStyle = colors[color];
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${colorStyle.bg} ${colorStyle.border} border rounded-lg flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${colorStyle.icon}`} />
          </div>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorStyle.bar} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
}

export default ProviderDashboard;