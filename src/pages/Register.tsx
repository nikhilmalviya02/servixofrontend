import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Quote, CheckCircle } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    { value: "user", label: "As a User", desc: "Book services" },
    { value: "provider", label: "As a Service Provider", desc: "Offer services" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F5F0]">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
              <p className="text-gray-500 text-sm">Create your account and start your journey</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.22 7.13-.57 1.5-1.31 2.99-2.27 4.08zm-5.85-15.1c.07-2.04 1.76-3.79 3.78-3.94.29 2.32-1.93 4.48-3.78 3.94z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Sign up with Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="hello@delisaas.com"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to SignUp
                </label>
                <div className="flex items-center justify-center gap-6">
                  {roleOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={form.role === option.value}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-4 h-4 text-emerald-700 border-gray-300 focus:ring-emerald-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    agreedToTerms 
                      ? 'bg-emerald-700 border-emerald-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {agreedToTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
                <p className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-700 hover:text-emerald-800">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-emerald-700 hover:text-emerald-800">Privacy Policy</Link>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-700 font-semibold hover:text-emerald-800">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Quote */}
          <div className="mb-8">
            <Quote className="w-10 h-10 text-amber-500 mb-4" />
            <p className="text-xl text-gray-800 leading-relaxed">
              Seamless booking experience! The app makes finding and reserving services so easy. I loved the instant confirmation and personalized recommendations. Definitely my go-to for all future needs.
            </p>
            <Quote className="w-10 h-10 text-amber-500 mt-4 rotate-180" />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">AM</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Alex Mitchell</h4>
              <p className="text-sm text-gray-500">Amsterdam</p>
            </div>
          </div>
        </div>

        {/* City Illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-80">
          <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            {/* Background buildings */}
            <rect x="50" y="120" width="60" height="200" fill="#E8E4DC" stroke="#2D3748" strokeWidth="2"/>
            <rect x="120" y="80" width="80" height="240" fill="#F5F5F0" stroke="#2D3748" strokeWidth="2"/>
            <rect x="210" y="150" width="50" height="170" fill="#E8E4DC" stroke="#2D3748" strokeWidth="2"/>
            <rect x="280" y="60" width="70" height="260" fill="#F5F5F0" stroke="#2D3748" strokeWidth="2"/>
            <rect x="370" y="100" width="90" height="220" fill="#E8E4DC" stroke="#2D3748" strokeWidth="2"/>
            <rect x="480" y="40" width="65" height="280" fill="#F5F5F0" stroke="#2D3748" strokeWidth="2"/>
            <rect x="570" y="130" width="75" height="190" fill="#E8E4DC" stroke="#2D3748" strokeWidth="2"/>
            <rect x="670" y="90" width="85" height="230" fill="#F5F5F0" stroke="#2D3748" strokeWidth="2"/>
            
            {/* Windows pattern */}
            <g fill="#2D3748" opacity="0.3">
              <rect x="135" y="100" width="8" height="12"/>
              <rect x="155" y="100" width="8" height="12"/>
              <rect x="135" y="130" width="8" height="12"/>
              <rect x="155" y="130" width="8" height="12"/>
              <rect x="135" y="160" width="8" height="12"/>
              <rect x="155" y="160" width="8" height="12"/>
              <rect x="135" y="190" width="8" height="12"/>
              <rect x="155" y="190" width="8" height="12"/>
            </g>
            
            {/* Trees */}
            <circle cx="100" cy="280" r="15" fill="none" stroke="#2D3748" strokeWidth="2"/>
            <line x1="100" y1="295" x2="100" y2="320" stroke="#2D3748" strokeWidth="2"/>
            <circle cx="350" cy="290" r="12" fill="none" stroke="#2D3748" strokeWidth="2"/>
            <line x1="350" y1="302" x2="350" y2="320" stroke="#2D3748" strokeWidth="2"/>
            <circle cx="620" cy="285" r="14" fill="none" stroke="#2D3748" strokeWidth="2"/>
            <line x1="620" y1="299" x2="620" y2="320" stroke="#2D3748" strokeWidth="2"/>
            
            {/* Ground line */}
            <line x1="0" y1="320" x2="800" y2="320" stroke="#2D3748" strokeWidth="3"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Register;