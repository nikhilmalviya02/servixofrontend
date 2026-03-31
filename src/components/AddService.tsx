import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface ServiceForm {
  title: string;
  description: string;
  category: string;
  price: string;
}

interface AddServiceProps {
  onServiceAdded?: () => void;
  compact?: boolean;
}

const categories = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Gardening",
  "Appliance Repair",
  "Pest Control",
  "Other",
];

function AddService({ onServiceAdded, compact = false }: AddServiceProps) {
  const [form, setForm] = useState<ServiceForm>({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category || !form.price) {
      toast.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await axios.post(
        "https://servixobackend.vercel.app/api/services",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Service added successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
      });

      onServiceAdded?.();
    } catch (error) {
      toast.error("Error adding service");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            placeholder="Service Title"
            className="border border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter"
            onChange={handleChange}
          />

          <select
            name="category"
            value={form.category}
            className="border border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description"
          value={form.description}
          placeholder="Service Description"
          rows={3}
          className="border border-blue-500 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter resize-none"
          onChange={handleChange}
        />

        <div className="flex gap-4">
          <input
            name="price"
            type="number"
            value={form.price}
            placeholder="Price (₹)"
            className="border border-gray-200 rounded-lg p-3 w-40 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 transition">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 font-inter">
          Add New Service
        </h2>

        <input
          name="title"
          value={form.title}
          placeholder="Service Title"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter"
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Service Description"
          rows={3}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter resize-none"
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter"
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          value={form.price}
          placeholder="Price (₹)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-inter"
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}

export default AddService;