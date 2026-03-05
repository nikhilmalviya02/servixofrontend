import { useEffect, useState } from "react";
import axios from "axios";

function AddressManager() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const token = localStorage.getItem("token");

  const fetchAddresses = () => {
    axios
      .get("https://servixobackend.vercel.app/api/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddresses(res.data));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingId) {
      // Update
      await axios.put(
        `https://servixobackend.vercel.app/api/user/address/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
    } else {
      // Add
      await axios.post(
        "https://servixobackend.vercel.app/api/user/address",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setForm({
      label: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    });

    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(
      `https://servixobackend.vercel.app/api/user/address/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAddresses();
  };

  const handleEdit = (addr: any) => {
    setEditingId(addr._id);
    setForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {editingId ? "Update your address details" : "Enter your complete address information"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Label Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Address Label <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                placeholder="e.g., Home, Office, Parents House"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                placeholder-gray-400"
                value={form.label}
                onChange={(e) =>
                  setForm({ ...form, label: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Street Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <textarea
                placeholder="House/Building number, Street name, Landmark"
                rows={2}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none
                placeholder-gray-400"
                value={form.street}
                onChange={(e) =>
                  setForm({ ...form, street: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  placeholder="Enter city"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                  placeholder-gray-400"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                  </svg>
                </div>
                <input
                  placeholder="Enter state"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                  placeholder-gray-400"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Pincode Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="6 digit pincode"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                placeholder-gray-400"
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })
                }
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
              text-white px-6 py-3.5 rounded-xl font-semibold
              shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {editingId ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
              {editingId ? "Update Address" : "Add Address"}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ label: "", street: "", city: "", state: "", pincode: "" });
                }}
                className="px-6 py-3.5 rounded-xl font-semibold
                bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300
                transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h4 className="font-semibold text-lg">
              {addr.label}
            </h4>
            <p>{addr.street}</p>
            <p>{addr.city}, {addr.state}</p>
            <p>{addr.pincode}</p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(addr._id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressManager;