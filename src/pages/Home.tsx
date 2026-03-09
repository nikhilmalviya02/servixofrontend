import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Star,
  ArrowRight,
  Clock,
  Award,
  Calendar,
  MapPin,
  Package,
  TrendingUp,
  Search,
  ChevronRight,
  HomeIcon
} from "lucide-react";

function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    // Get user name from localStorage or user object
    const userStr = localStorage.getItem("user");
    let storedName = "Guest";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        storedName = user.name || "Guest";
        // Also store name separately for future use
        localStorage.setItem("name", storedName);
      } catch {
        storedName = localStorage.getItem("name") || "Guest";
      }
    } else {
      storedName = localStorage.getItem("name") || "Guest";
    }
    setUserName(storedName);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch services
    axios.get("https://servixobackend.vercel.app/api/services?limit=6").then((res) => {
      setServices(res.data.slice(0, 6));
    }).catch(() => {});

    // Fetch user's recent bookings
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("https://servixobackend.vercel.app/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setBookings(res.data.slice(0, 3));
      }).catch(() => {});
    }
  }, []);

  const role = localStorage.getItem("role");

  // Redirect providers and admins to their respective dashboards
  if (role === "provider") {
    return <Navigate to="/provider" replace />;
  }
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const quickActions = [
    { icon: Search, label: "Find Services", color: "bg-indigo-500", link: "/services" },
    { icon: Calendar, label: "My Bookings", color: "bg-purple-500", link: "/user" },
    { icon: HomeIcon, label: "Address", color: "bg-orange-500", link: "/addresses" }
  ];

  const categories = [
    { icon: "🧹", name: "Cleaning", color: "from-green-400 to-emerald-500" },
    { icon: "🔧", name: "Plumbing", color: "from-blue-400 to-cyan-500" },
    { icon: "⚡", name: "Electrical", color: "from-yellow-400 to-orange-500" },
    { icon: "❄️", name: "AC Repair", color: "from-cyan-400 to-blue-500" },
    { icon: "🎨", name: "Painting", color: "from-pink-400 to-rose-500" },
    { icon: "🪴", name: "Gardening", color: "from-green-400 to-teal-500" },
    { icon: "🚗", name: "Vehicle", color: "from-red-400 to-pink-500" },
    { icon: "🔨", name: "Carpentry", color: "from-orange-400 to-amber-500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/80 text-sm font-medium">{greeting}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {userName.split(" ")[0]}! 👋
              </h1>
              <p className="mt-2 text-white/80 max-w-xl">
                Ready to book your next service? Explore our wide range of trusted professionals.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-white/70">Active Bookings</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                <p className="text-2xl font-bold">{services.length}+</p>
                <p className="text-sm text-white/70">Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <p className="text-gray-500 text-sm">Track your service requests</p>
            </div>
            <Link to="/user" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.service?.title || "Service"}</p>
                      <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{booking.address?.street || "Address not set"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Browse Categories */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-500 text-sm">Find services by category</p>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/services"
              className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                {cat.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Services */}
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            <p className="text-gray-500 text-sm">Popular services you might like</p>
          </div>
          <Link to="/services" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(services.length > 0 ? services : [
            { icon: "🧹", title: "Home Cleaning", price: "499", color: "from-indigo-400 to-purple-500", rating: 4.8 },
            { icon: "🔧", title: "Plumbing Service", price: "299", color: "from-blue-400 to-cyan-500", rating: 4.7 },
            { icon: "⚡", title: "Electrical Repair", price: "349", color: "from-yellow-400 to-orange-500", rating: 4.9 },
            { icon: "❄️", title: "AC Service & Repair", price: "599", color: "from-cyan-400 to-blue-500", rating: 4.8 },
            { icon: "🎨", title: "Home Painting", price: "1999", color: "from-pink-400 to-rose-500", rating: 4.6 },
            { icon: "🪴", title: "Garden Maintenance", price: "399", color: "from-green-400 to-teal-500", rating: 4.7 },
          ]).map((service: any, idx: number) => (
            <Link
              key={service._id || idx}
              to="/services"
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative h-40 overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${service.color || "from-indigo-400 to-purple-500"} flex items-center justify-center`}>
                    <span className="text-6xl">{service.icon}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{service.averageRating?.toFixed(1) || service.rating || "4.8"}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg">{service.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-indigo-600 font-bold text-xl">₹{service.price}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Same day</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us - Compact */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Professionals</h3>
                <p className="text-gray-500 text-sm">Background checked experts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Scheduling</h3>
                <p className="text-gray-500 text-sm">Book in just a few clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                <p className="text-gray-500 text-sm">100% secure transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-300" />
              <span className="text-white/80 font-medium">New Services Added Weekly</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Need a Different Service?
            </h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              Browse our complete catalog of 500+ verified services and find exactly what you need.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 mt-6 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span className="font-medium text-gray-700">Top Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-700">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-700">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-700">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;