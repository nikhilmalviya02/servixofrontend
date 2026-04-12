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
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            name="title"
            value={form.title}
            placeholder="Service Title"
            className="border border-gray-200 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter text-sm"
            onChange={handleChange}
          />

          <select
            name="category"
            value={form.category}
            className="border border-gray-200 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter text-sm"
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
          className="border border-blue-500 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter resize-none text-sm"
          onChange={handleChange}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            name="price"
            type="number"
            value={form.price}
            placeholder="Price (₹)"
            className="border border-gray-200 rounded-lg p-2.5 w-full sm:w-32 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 transition font-inter text-sm"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed font-inter text-sm flex-1 sm:flex-none"
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 transition px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 font-inter">
          Add New Service
        </h2>

        <input
          name="title"
          value={form.title}
          placeholder="Service Title"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter text-base"
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Service Description"
          rows={3}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter resize-none text-base"
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter text-base"
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
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 transition font-inter text-base"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-inter text-base"
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}

export default AddService;