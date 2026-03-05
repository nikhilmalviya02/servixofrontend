import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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

  // View Reviews states
  const [viewReviewsModal, setViewReviewsModal] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Fetch Services
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

  // 🔹 Fetch Addresses
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

  // 🔹 Booking Handler
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

  // 🔹 Submit Review
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
      fetchServices(); // Refresh rating
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add review");
    }
  };

  // 🔹 Fetch Reviews for a service
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Explore Services
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Find trusted professionals near you.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto mb-6">
        <input
          placeholder="Search services..."
          className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-3 mb-6">
        <select
          className="border p-2 rounded-lg dark:bg-gray-800 dark:text-white"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrician">Electrician</option>
          <option value="Cleaning">Cleaning</option>
        </select>

        <select
          className="border p-2 rounded-lg dark:bg-gray-800 dark:text-white"
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Min Rating</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded-lg dark:bg-gray-800 dark:text-white"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg dark:bg-gray-800 dark:text-white"
          onChange={(e) => setSort(e.target.value)}
          value={sort}
        >
          <option value="">Sort</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading && (
        <div className="text-center text-blue-600 font-semibold">
          Loading services...
        </div>
      )}

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div
            key={s._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            {s.image && (
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h2 className="font-semibold text-lg text-blue-600">
              {s.title}
            </h2>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 font-semibold">
                ⭐ {s.averageRating ? s.averageRating.toFixed(1) : "0.0"}
              </span>
              <button
                onClick={() => fetchReviews(s._id, s.title)}
                className="text-gray-500 text-sm dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
              >
                ({s.totalReviews || 0} reviews)
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {s.description}
            </p>

            {/* Provider + Verified Badge */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {s.provider?._id ? (
                <Link
                  to={`/provider/profile/${s.provider._id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {s.provider?.name}
                </Link>
              ) : (
                s.provider?.name
              )}

              {s.provider?.isVerified && (
                <span className="ml-2 text-green-600 font-semibold">
                  ✔ Verified
                </span>
              )}
            </div>

            {/* Buttons - Only show Book Now and Add Review for customers (user role) */}
            {role === "user" && (
              <>
                <button
                  className="bg-blue-600 text-white w-full mt-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setSelectedService(s)}
                >
                  Book Now
                </button>

                <button
                  className="border border-yellow-500 text-yellow-600 w-full mt-2 py-2 rounded-lg hover:bg-yellow-50"
                  onClick={() => {
                    setReviewModal(true);
                    setReviewServiceId(s._id);
                  }}
                >
                  Add Review
                </button>
              </>
            )}
            {role === "provider" && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-sm text-gray-600 dark:text-gray-400">
                Provider Account - Manage your services from Dashboard
              </div>
            )}
            {role === "admin" && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center text-sm text-gray-600 dark:text-gray-400">
                Admin Account - Manage all services from Admin Panel
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Book {selectedService.title}
            </h2>

            <select
              className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
              value={selectedAddressIndex ?? ""}
              onChange={(e) =>
                setSelectedAddressIndex(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <option value="">Select Address</option>
              {addresses.map((addr, index) => (
                <option key={index} value={index}>
                  {addr.label} - {addr.city}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select
              className="border p-2 w-full mb-3 dark:bg-gray-700 dark:text-white"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">Select Time Slot</option>
              <option>10AM - 12PM</option>
              <option>12PM - 2PM</option>
              <option>2PM - 4PM</option>
            </select>

            <label className="flex items-center gap-2 mb-3 dark:text-white">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
              />
              Emergency Booking
            </label>

            <div className="flex justify-between">
              <button
                className="bg-gray-400 px-4 py-1 rounded"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </button>

              <button
                disabled={bookingLoading}
                className="bg-green-600 text-white px-4 py-1 rounded"
                onClick={handleConfirmBooking}
              >
                {bookingLoading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 dark:text-white">
              Add Review
            </h2>

            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write your experience..."
              className="border w-full p-2 rounded dark:bg-gray-700 dark:text-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setReviewModal(false)}>
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={submitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW REVIEWS MODAL */}
      {viewReviewsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reviews
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedServiceName}
                </p>
              </div>
              <button
                onClick={() => setViewReviewsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Reviews List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsList.map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {review.user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {review.user?.name || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {review.comment || "No comment"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <button
                onClick={() => setViewReviewsModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;