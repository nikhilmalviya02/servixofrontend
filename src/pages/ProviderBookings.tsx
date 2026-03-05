import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BookingTimeline from "../components/BookingTimeline";

function ProviderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      accepted: bookings.filter((b) => b.status === "accepted").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    };
  }, [bookings]);

  const statusColor = (status: string) => {
    if (status === "accepted")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "rejected")
      return "bg-red-100 text-red-700 border-red-200";
    if (status === "completed")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "cancelled")
      return "bg-gray-200 text-gray-700 border-gray-300";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="min-h-screen px-6 py-10 pt-4
      bg-gradient-to-br from-indigo-50 via-white to-purple-50 
      dark:from-gray-900 dark:via-gray-800 dark:to-black 
      transition-all duration-300">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Provider Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage and respond to your customer requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard title="Total" value={stats.total} color="indigo" />
          <StatCard title="Pending" value={stats.pending} color="yellow" />
          <StatCard title="Accepted" value={stats.accepted} color="green" />
          <StatCard title="Completed" value={stats.completed} color="blue" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No bookings found.
          </div>
        )}

        {/* Booking Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className={`bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-lg 
              hover:shadow-2xl transition duration-300
              ${b.isEmergency ? "border-red-500 border-2" : "border-gray-200 dark:border-gray-700"}`}
            >
              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {b.service?.title}
              </h2>

              {b.isEmergency && (
                <p className="text-red-600 font-semibold mt-1">
                  ⚡ Emergency Booking
                </p>
              )}

              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Customer: <span className="font-medium">{b.user?.name}</span>
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Date: {new Date(b.date).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Slot: {b.timeSlot}
              </p>

              {/* Status Badge */}
              <span
                className={`inline-block px-3 py-1 mt-3 text-xs rounded-full border ${statusColor(
                  b.status
                )}`}
              >
                {b.status}
              </span>

              {/* 🔥 BOOKING TIMELINE */}
              <BookingTimeline status={b.status} />

              {/* Actions */}
              {b.status === "pending" && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => updateStatus(b._id, "accepted")}
                    className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(b._id, "rejected")}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Reject
                  </button>
                </div>
              )}

              {b.status === "accepted" && (
                <button
                  onClick={() => updateStatus(b._id, "completed")}
                  className="mt-6 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className={`p-4 rounded-xl text-center shadow-sm ${colors[color]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default ProviderBookings;