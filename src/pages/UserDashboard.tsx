import { useEffect, useState } from "react";
import axios from "axios";
import AddressManager from "../components/AddressManager";
import BookingTimeline from "../components/BookingTimeline";

function UserDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const token = localStorage.getItem("token");

  // Fetch bookings
  const fetchBookings = () => {
    axios
      .get("https://servixobackend.vercel.app/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel Booking
  const cancelBooking = async (id: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  // Reschedule Booking
  const rescheduleBooking = async (id: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/reschedule/${id}`,
        {
          date: newDate,
          timeSlot: newSlot,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRescheduleId(null);
      setNewDate("");
      setNewSlot("");
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-10 pt-4
      bg-gradient-to-br from-gray-50 via-white to-gray-100 
      dark:from-gray-900 dark:via-gray-800 dark:to-black 
      text-gray-800 dark:text-gray-100 transition-all duration-300"
    >
      <h1 className="text-3xl font-bold mb-10 tracking-tight">
        User Dashboard
      </h1>

      {/* ADDRESS SECTION */}
      <div
        className="mb-14 bg-white dark:bg-gray-800 
        p-6 rounded-2xl shadow-lg border 
        border-gray-200 dark:border-gray-700 transition"
      >
        <AddressManager />
      </div>

      {/* BOOKINGS SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            My Bookings
          </h2>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No bookings yet.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Book a service to get started
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 
              p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 
              hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 
              transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {b.service?.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Date</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(b.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Slot</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{b.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Address</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{b.address?.street}, {b.address?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOOKING TIMELINE */}
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <BookingTimeline status={b.status} />
              </div>

              {/* ACTION BUTTONS */}
              {(b.status === "pending" || b.status === "accepted") && (
                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => cancelBooking(b._id)}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50
                    text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl 
                    border border-red-200 dark:border-red-800
                    transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>

                  <button
                    onClick={() => setRescheduleId(b._id)}
                    className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50
                    text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl 
                    border border-amber-200 dark:border-amber-800
                    transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Reschedule
                  </button>
                </div>
              )}

              {/* RESCHEDULE FORM */}
              {rescheduleId === b._id && (
                <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Select New Date & Time
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Date</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 dark:border-gray-600 
                        p-3 rounded-xl bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Time Slot</label>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 
                        p-3 rounded-xl bg-white dark:bg-gray-700 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                      >
                        <option value="">Select Slot</option>
                        <option>10AM - 12PM</option>
                        <option>12PM - 2PM</option>
                        <option>2PM - 4PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => rescheduleBooking(b._id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 
                      text-white px-5 py-2.5 rounded-xl 
                      shadow-lg shadow-green-500/30 hover:shadow-green-500/50
                      transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Reschedule
                    </button>
                    <button
                      onClick={() => {setRescheduleId(null); setNewDate(""); setNewSlot("");}}
                      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                      text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl 
                      transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* REPEAT BOOKING */}
              {b.status === "completed" && (
                <button
                  className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                  text-white px-5 py-2.5 rounded-xl 
                  shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                  transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Book Again
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;