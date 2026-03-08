import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ShieldCheck, 
  CalendarCheck, 
  CreditCard, 
  Search, 
  UserCheck, 
  Calendar, 
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Clock,
  Award
} from "lucide-react";

function Home() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    axios.get("https://servixobackend.vercel.app/api/services?limit=4").then((res) => {
      setServices(res.data.slice(0, 4));
    }).catch(() => {});
  }, []);


  const role = localStorage.getItem("role");

  // Redirect providers and admins to their respective dashboards
  if (role === "provider") {
    return <Navigate to="/provider" replace />;
  }
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Find Trusted <span className="text-indigo-600">Services</span> Near You
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
            Book verified professionals for home services like plumbing,
            cleaning, electricians, and more. Fast, reliable, and secure
            solutions at your fingertips.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-8 md:gap-16 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">500+</p>
              <p className="text-gray-500 text-sm">Verified Providers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">10k+</p>
              <p className="text-gray-500 text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600">4.9</p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose ServexaGo?
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-14">
            <div className="p-8 bg-white border border-gray-100 rounded-2xl">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Verified Professionals
              </h3>
              <p className="text-gray-600 mt-3">
                All service providers are background checked and verified
                to ensure trust and quality.
              </p>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-2xl">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <CalendarCheck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Easy Booking
              </h3>
              <p className="text-gray-600 mt-3">
                Book services in just a few clicks with a smooth and
                modern experience.
              </p>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-2xl">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Secure Payments
              </h3>
              <p className="text-gray-600 mt-3">
                Safe and encrypted payment options for complete
                protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Services
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Most booked services by our customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service._id}>
                  <Link
                    to="/services"
                    className="block bg-white border border-gray-100 rounded-2xl overflow-hidden"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={service.image || "https://via.placeholder.com/300x200"}
                        alt={service.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {service.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-indigo-600 font-bold mt-2">₹{service.price}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Same day service</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <>
                {[
                  { icon: "🧹", title: "Home Cleaning", price: "From ₹499", color: "bg-indigo-100" },
                  { icon: "🔧", title: "Plumbing", price: "From ₹299", color: "bg-blue-100" },
                  { icon: "⚡", title: "Electrical", price: "From ₹349", color: "bg-yellow-100" },
                  { icon: "❄️", title: "AC Repair", price: "From ₹599", color: "bg-green-100" }
                ].map((item, idx) => (
                  <div key={idx}>
                    <Link
                      to="/services"
                      className="block bg-white border border-gray-100 rounded-2xl overflow-hidden"
                    >
                      <div className={`h-40 ${item.color} flex items-center justify-center`}>
                        <span className="text-6xl">{item.icon}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-indigo-600 font-bold mt-2">{item.price}</p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Same day service</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Find the right service for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: "🧹", name: "Cleaning", color: "bg-green-100", count: "50+ services" },
              { icon: "🔧", name: "Plumbing", color: "bg-blue-100", count: "30+ services" },
              { icon: "⚡", name: "Electrical", color: "bg-yellow-100", count: "25+ services" },
              { icon: "❄️", name: "AC & Appliances", color: "bg-cyan-100", count: "40+ services" },
              { icon: "🎨", name: "Painting", color: "bg-pink-100", count: "20+ services" },
              { icon: "🪴", name: "Gardening", color: "bg-green-100", count: "15+ services" },
              { icon: "🚗", name: "Vehicle Care", color: "bg-red-100", count: "35+ services" },
              { icon: "🔨", name: "Carpentry", color: "bg-orange-100", count: "18+ services" },
            ].map((cat) => (
              <div key={cat.name}>
                <Link
                  to="/services"
                  className="block bg-white rounded-2xl p-6 text-center border border-gray-100"
                >
                  <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-4">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Book your service in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-14">
            {[
              { step: "1", icon: Search, title: "Search", desc: "Find the service you need from our wide range" },
              { step: "2", icon: UserCheck, title: "Choose Provider", desc: "Select from verified professionals" },
              { step: "3", icon: Calendar, title: "Book & Pay", desc: "Schedule and pay securely online" },
              { step: "4", icon: CheckCircle, title: "Get It Done", desc: "Relax while we handle the rest" },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                {item.step !== "4" && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gray-200" />
                )}
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-100">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mt-6">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-indigo-600 text-white py-14 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Book Your First Service?
            </h2>

            <p className="mt-4 text-white/90">
              Join thousands of users already using ServexaGo.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 mt-8 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-indigo-600" />
              <span className="font-semibold text-gray-700">Top Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <span className="font-semibold text-gray-700">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-gray-700">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-gray-700">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;