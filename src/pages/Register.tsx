import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    servicesOffered: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://servixobackend.vercel.app/api/auth/register", form);

      toast.success("Registered successfully 🎉");

      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "user", label: "Customer", icon: "👤", desc: "Book services" },
    { value: "provider", label: "Service Provider", icon: "🛠️", desc: "Offer services" },
  ];

  // Service categories available for providers
  const serviceCategories = [
    { name: "Cleaning", icon: "🧹" },
    { name: "Plumbing", icon: "🔧" },
    { name: "Electrical", icon: "⚡" },
    { name: "AC & Appliances", icon: "❄️" },
    { name: "Painting", icon: "🎨" },
    { name: "Gardening", icon: "🪴" },
    { name: "Vehicle Care", icon: "🚗" },
    { name: "Carpentry", icon: "🔨" },
    { name: "Pest Control", icon: "🐜" },
    { name: "Home Security", icon: "🔒" },
    { name: "Interior Design", icon: "🏠" },
    { name: "Moving & Packing", icon: "📦" },
  ];

  // Fetch available services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("https://servixobackend.vercel.app/api/services");
        // Extract unique categories from services
        const categories = [...new Set(res.data.map((s: any) => s.category))] as string[];
        if (categories.length > 0) {
          setAvailableServices(categories);
        }
      } catch (error) {
        // If API fails, use default categories
        setAvailableServices(serviceCategories.map(s => s.name));
      }
    };
    fetchServices();
  }, []);

  const toggleService = (serviceName: string) => {
    setForm((prev) => {
      const currentServices = prev.servicesOffered || [];
      if (currentServices.includes(serviceName)) {
        return { ...prev, servicesOffered: currentServices.filter((s) => s !== serviceName) };
      } else {
        return { ...prev, servicesOffered: [...currentServices, serviceName] };
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join Servixo and start your journey</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={show ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: option.value, servicesOffered: [] })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      form.role === option.value
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-200 dark:border-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className={`font-semibold text-sm ${
                      form.role === option.value ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Selection for Providers */}
            {form.role === "provider" && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which services do you want to offer? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Select at least one service category</p>
                
                {/* Service Dropdown */}
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !form.servicesOffered?.includes(value)) {
                        toggleService(value);
                      }
                      e.target.value = ""; // Reset dropdown after selection
                    }}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="">-- Select a service --</option>
                    {serviceCategories.map((service) => (
                      <option 
                        key={service.name} 
                        value={service.name}
                        disabled={form.servicesOffered?.includes(service.name)}
                      >
                        {service.icon} {service.name}
                        {form.servicesOffered?.includes(service.name) ? " (Selected)" : ""}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Selected Services Tags */}
                {form.servicesOffered && form.servicesOffered.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Selected services:</p>
                    <div className="flex flex-wrap gap-2">
                      {form.servicesOffered.map((serviceName) => {
                        const service = serviceCategories.find(s => s.name === serviceName);
                        return (
                          <span
                            key={serviceName}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                          >
                            <span>{service?.icon}</span>
                            <span>{serviceName}</span>
                            <button
                              type="button"
                              onClick={() => toggleService(serviceName)}
                              className="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-indigo-200 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                  agreedToTerms 
                    ? 'bg-indigo-600 border-indigo-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {agreedToTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </button>
              <p className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                disabled={loading || !agreedToTerms}
                className="w-full py-3 rounded-lg font-semibold text-white bg-indigo-600 
                  hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
