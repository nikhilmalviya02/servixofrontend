import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Star, Clock, MapPin, Calendar, 
  X, ChevronDown, Shield
} from "lucide-react";

function Services() {
  const role = localStorage.getItem("role");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [selectedService, setSelectedService] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [reviewModal, setReviewModal] = useState(false);
  const [reviewServiceId, setReviewServiceId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [viewReviewsModal, setViewReviewsModal] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search,
        category,
        minRating,
        maxPrice,
        sort,
      });

      const res = await axios.get(
        `https://servixobackend.vercel.app/api/services?${params}`
      );

      setServices(res.data);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://servixobackend.vercel.app/api/user/address",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data);
    } catch {
      console.log("No addresses found");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, category, minRating, maxPrice, sort]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleConfirmBooking = async () => {
    if (!token) return toast.error("Please login first");
    if (selectedAddressIndex === null) return toast.error("Select address");
    if (!date) return toast.error("Select date");
    if (!timeSlot) return toast.error("Select time slot");

    try {
      setBookingLoading(true);

      await axios.post(
        "https://servixobackend.vercel.app/api/bookings",
        {
          serviceId: selectedService._id,
          address: addresses[selectedAddressIndex],
          date,
          timeSlot,
          isEmergency,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking created successfully 🎉");
      setSelectedService(null);
      setDate("");
      setTimeSlot("");
      setIsEmergency(false);
      setSelectedAddressIndex(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async () => {
    if (!token) return toast.error("Login required");

    try {
      await axios.post(
        "https://servixobackend.vercel.app/api/reviews",
        {
          serviceId: reviewServiceId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added ⭐");
      setReviewModal(false);
      setComment("");
      fetchServices();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add review");
    }
  };

  const fetchReviews = async (serviceId: string, serviceName: string) => {
    setReviewsLoading(true);
    setSelectedServiceName(serviceName);
    try {
      const res = await axios.get(`https://servixobackend.vercel.app/api/reviews/${serviceId}`);
      setReviewsList(res.data);
      setViewReviewsModal(true);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { value: "", label: "All Categories", icon: "✨" },
    { value: "Plumbing", label: "Plumbing", icon: "🔧" },
    { value: "Electrician", label: "Electrical", icon: "⚡" },
    { value: "Cleaning", label: "Cleaning", icon: "🧹" },
    { value: "AC Repair", label: "AC & Appliances", icon: "❄️" },
    { value: "Painting", label: "Painting", icon: "🎨" },
    { value: "Carpentry", label: "Carpentry", icon: "🔨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 pt-20 pb-12">
      {/* Header Section */}
      <div className="container-modern mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find <span className="gradient-text">Expert Services</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our curated list of professional services and book with confidence
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100">
                  <select
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    onChange={(e) => setMinRating(e.target.value)}
                    value={minRating}
                  >
                    <option value="">⭐ Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>

                  <input
                    type="number"
                    placeholder="💰 Max Price"
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />

                  <select
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    onChange={(e) => setSort(e.target.value)}
                    value={sort}
                  >
                    <option value="">📊 Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Results Count */}
      <div className="container-modern mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> services
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container-modern">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!loading && (
        <div className="container-modern">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, index) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={s.image || "https://via.placeholder.com/400x300"}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-lg font-bold text-indigo-600">₹{s.price}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-sm font-medium rounded-lg">
                      {s.category || "Service"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {s.title}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-yellow-700">
                        {s.averageRating ? s.averageRating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                    <button
                      onClick={() => fetchReviews(s._id, s.title)}
                      className="text-sm text-gray-500 hover:text-indigo-600 underline transition"
                    >
                      {s.totalReviews || 0} reviews
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {s.description}
                  </p>

                  {/* Provider */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {s.provider?.name?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      {s.provider?._id ? (
                        <Link
                          to={`/provider/profile/${s.provider._id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600 truncate block"
                        >
                          {s.provider?.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-900 truncate block">
                          {s.provider?.name}
                        </span>
                      )}
                      {s.provider?.isVerified && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {role === "user" && (
                    <div className="space-y-2">
                      <button
                        className="w-full btn-primary py-3 text-sm"
                        onClick={() => setSelectedService(s)}
                      >
                        Book Now
                      </button>
                      <button
                        className="w-full btn-secondary py-3 text-sm"
                        onClick={() => {
                          setReviewModal(true);
                          setReviewServiceId(s._id);
                        }}
                      >
                        Write a Review
                      </button>
                    </div>
                  )}
                  
                  {(role === "provider" || role === "admin") && (
                    <div className="p-3 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
                      {role === "provider" ? "Provider View" : "Admin View"}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Book Service</h2>
                    <p className="text-white/80 text-sm">{selectedService.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" /> Select Address
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={selectedAddressIndex ?? ""}
                    onChange={(e) =>
                      setSelectedAddressIndex(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Choose an address</option>
                    {addresses.map((addr, index) => (
                      <option key={index} value={index}>
                        {addr.label} - {addr.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" /> Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" /> Time Slot
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="">Select time</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 2:00 PM</option>
                    <option>2:00 PM - 4:00 PM</option>
                    <option>4:00 PM - 6:00 PM</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-4 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <div>
                    <span className="font-medium text-red-700">Emergency Booking</span>
                    <p className="text-sm text-red-600/70">Priority service within 2 hours</p>
                  </div>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                    onClick={() => setSelectedService(null)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={bookingLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
                    onClick={handleConfirmBooking}
                  >
                    {bookingLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
              
              <div className="flex gap-2 mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share your experience..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setReviewModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition"
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW REVIEWS MODAL */}
      <AnimatePresence>
        {viewReviewsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                  <p className="text-sm text-gray-500">{selectedServiceName}</p>
                </div>
                <button
                  onClick={() => setViewReviewsModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reviews List */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No reviews yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsList.map((review) => (
                      <div
                        key={review._id}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {review.user?.name || "Anonymous"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-yellow-700">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {review.comment || "No comment provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setViewReviewsModal(false)}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Services;