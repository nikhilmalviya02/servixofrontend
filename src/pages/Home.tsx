import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
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
    axios.get("http://localhost:5000/api/services?limit=4").then((res) => {
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Find Trusted <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Services</span> Near You
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
            Book verified professionals for home services like plumbing,
            cleaning, electricians, and more. Fast, reliable, and secure
            solutions at your fingertips.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="group px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition flex items-center gap-2"
            >
              Explore Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
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
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 
            {...fadeInUp}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Why Choose Servixo?
          </motion.h2>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10 mt-14"
          >
            <motion.div 
              variants={fadeInUp}
              className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition group"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Verified Professionals
              </h3>
              <p className="text-gray-600 mt-3">
                All service providers are background checked and verified
                to ensure trust and quality.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition group"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <CalendarCheck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Easy Booking
              </h3>
              <p className="text-gray-600 mt-3">
                Book services in just a few clicks with a smooth and
                modern experience.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="p-8 bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition group"
            >
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <CreditCard className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Secure Payments
              </h3>
              <p className="text-gray-600 mt-3">
                Safe and encrypted payment options for complete
                protection.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Services
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Most booked services by our customers
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service._id}
                  variants={fadeInUp}
                >
                  <Link
                    to="/services"
                    className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={service.image || "https://via.placeholder.com/300x200"}
                        alt={service.title}
                        className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
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
                </motion.div>
              ))
            ) : (
              <>
                {[
                  { icon: "🧹", title: "Home Cleaning", price: "From ₹499", color: "bg-indigo-100" },
                  { icon: "🔧", title: "Plumbing", price: "From ₹299", color: "bg-blue-100" },
                  { icon: "⚡", title: "Electrical", price: "From ₹349", color: "bg-yellow-100" },
                  { icon: "❄️", title: "AC Repair", price: "From ₹599", color: "bg-green-100" }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Link
                      to="/services"
                      className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition"
                    >
                      <div className={`relative h-40 ${item.color} flex items-center justify-center`}>
                        <span className="text-6xl group-hover:scale-110 transition duration-500">{item.icon}</span>
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
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition group"
            >
              View All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Find the right service for your needs
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
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
              <motion.div key={cat.name} variants={fadeInUp}>
                <Link
                  to="/services"
                  className="group block bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition"
                >
                  <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto group-hover:scale-110 group-hover:rotate-3 transition`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-4">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 mt-4 text-center max-w-2xl mx-auto">
              Book your service in 4 simple steps
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 mt-14"
          >
            {[
              { step: "1", icon: Search, title: "Search", desc: "Find the service you need from our wide range" },
              { step: "2", icon: UserCheck, title: "Choose Provider", desc: "Select from verified professionals" },
              { step: "3", icon: Calendar, title: "Book & Pay", desc: "Schedule and pay securely online" },
              { step: "4", icon: CheckCircle, title: "Get It Done", desc: "Relax while we handle the rest" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center relative">
                {item.step !== "4" && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200" />
                )}
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-md border-2 border-indigo-100">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mt-6">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-14 px-8 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Book Your First Service?
              </h2>

              <p className="mt-4 text-white/90">
                Join thousands of users already using Servixo.
              </p>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 mt-8 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
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