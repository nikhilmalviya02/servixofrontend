import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  Award,
  MapPin,
  HeartHandshake,
  Sparkles,
  ChevronRight,
  Play,
  BadgeCheck
} from "lucide-react";

function LandingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get("https://servixobackend.vercel.app/api/services?limit=4").then((res) => {
      setServices(res.data.slice(0, 4));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Professionals",
      desc: "All service providers are background checked and verified to ensure trust and quality.",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: CalendarCheck,
      title: "Easy Booking",
      desc: "Book services in just a few clicks with a smooth and modern experience.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      desc: "Safe and encrypted payment options for complete protection.",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50"
    }
  ];

  const categories = [
    { icon: "🧹", name: "Cleaning", color: "from-green-400 to-emerald-600", count: "50+ services" },
    { icon: "🔧", name: "Plumbing", color: "from-blue-400 to-cyan-600", count: "30+ services" },
    { icon: "⚡", name: "Electrical", color: "from-yellow-400 to-orange-600", count: "25+ services" },
    { icon: "❄️", name: "AC & Appliances", color: "from-cyan-400 to-blue-600", count: "40+ services" },
    { icon: "🎨", name: "Painting", color: "from-pink-400 to-rose-600", count: "20+ services" },
    { icon: "🪴", name: "Gardening", color: "from-green-400 to-teal-600", count: "15+ services" },
    { icon: "🚗", name: "Vehicle Care", color: "from-red-400 to-pink-600", count: "35+ services" },
    { icon: "🔨", name: "Carpentry", color: "from-orange-400 to-amber-600", count: "18+ services" },
  ];

  const steps = [
    { icon: Search, title: "Search", desc: "Find the service you need from our wide range" },
    { icon: UserCheck, title: "Choose Provider", desc: "Select from verified professionals" },
    { icon: Calendar, title: "Book & Pay", desc: "Schedule and pay securely online" },
    { icon: CheckCircle, title: "Get It Done", desc: "Relax while we handle the rest" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Homeowner",
      content: "The cleaning service was exceptional! The professional arrived on time and did a thorough job. Highly recommend!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rahul Patel",
      role: "Business Owner",
      content: "Found a great electrician through ServexaGo. The booking process was seamless and the work was top-notch.",
      rating: 5,
      avatar: "RP"
    },
    {
      name: "Anita Desai",
      role: "Working Professional",
      content: "Love the convenience! Booked AC repair on Sunday evening and it was fixed by Monday morning. Great service!",
      rating: 5,
      avatar: "AD"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 10,000+ Customers</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                Find Trusted{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Services
                </span>{" "}
                Near You
              </h1>

              <p className="mt-6 text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Book verified professionals for home services like plumbing, cleaning, electricians, and more. Fast, reliable, and secure solutions at your fingertips.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 text-indigo-600" />
                  Explore Services
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">500+</p>
                  <p className="text-gray-500 text-sm mt-1">Verified Providers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10k+</p>
                  <p className="text-gray-500 text-sm mt-1">Happy Customers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">4.9</p>
                  <p className="text-gray-500 text-sm mt-1">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 p-6 border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <HeartHandshake className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Home Cleaning</h3>
                      <p className="text-sm text-gray-500">Professional Service</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <BadgeCheck className="w-5 h-5 text-green-500" />
                      <span>Background Verified Provider</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <span>Same Day Service Available</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <ShieldCheck className="w-5 h-5 text-purple-500" />
                      <span>Service Warranty Included</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-gray-900">₹499</p>
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              The Better Way to Get Things Done
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience hassle-free service booking with our trusted platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className={`group relative bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 ${
                  isVisible["features"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
                  <div className={`absolute w-16 h-16 bg-gradient-to-r ${feature.color} opacity-20 rounded-2xl`} />
                  <feature.icon className="w-8 h-8 text-gray-700 relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" data-animate className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Browse Categories
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Services We Offer
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                From home cleaning to repairs, find the right service for your needs
              </p>
            </div>
            <Link
              to="/login"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
            >
              View All Services
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.name}
                to="/login"
                className={`group relative bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  isVisible["categories"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" data-animate className="py-12 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Book your service in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div key={idx} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200" />
                )}
                <div className={`relative inline-block transition-all duration-700 ${
                  isVisible["how-it-works"] ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`} style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold border-4 border-indigo-100 shadow-lg">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mt-6 text-xl">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="popular" data-animate className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Most Popular
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trending Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Most booked services by our customers this week
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(services.length > 0 ? services : [
              { icon: "🧹", title: "Home Cleaning", price: "From ₹499", color: "from-indigo-400 to-purple-500" },
              { icon: "🔧", title: "Plumbing", price: "From ₹299", color: "from-blue-400 to-cyan-500" },
              { icon: "⚡", title: "Electrical", price: "From ₹349", color: "from-yellow-400 to-orange-500" },
              { icon: "❄️", title: "AC Repair", price: "From ₹599", color: "from-cyan-400 to-blue-500" }
            ]).map((service: any, idx: number) => (
              <Link
                key={service._id || idx}
                to="/login"
                className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 ${
                  isVisible["popular"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                      <span className="text-7xl">{service.icon}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{service.averageRating?.toFixed(1) || "4.8"}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                  <p className="text-indigo-600 font-bold mt-2 text-xl">{service.price || `₹${service.price}`}</p>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Same day service</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" data-animate className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real experiences from real customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.name}
                className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 ${
                  isVisible["testimonials"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-8 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of satisfied customers and book your first service today. It's free to sign up!
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  Browse Services
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Secure payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, label: "Top Rated", color: "text-indigo-600" },
              { icon: ShieldCheck, label: "Verified", color: "text-green-600" },
              { icon: Phone, label: "24/7 Support", color: "text-blue-600" },
              { icon: CreditCard, label: "Secure Payment", color: "text-purple-600" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-3">
                <badge.icon className={`w-8 h-8 ${badge.color}`} />
                <span className="font-semibold text-gray-700">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                ServexaGo
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner for all home services. Book verified professionals with ease.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition">Services</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition">Home Cleaning</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Plumbing</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Electrical</Link></li>
                <li><Link to="/login" className="hover:text-white transition">AC Repair</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 123 456 7890</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>support@servixago.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; 2026 ServexaGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
