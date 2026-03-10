import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award,
  ChevronRight
} from "lucide-react";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { AuthContext } from "../context/AuthContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    servicesOffered: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Get the Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = await firebaseUser.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.token, res.data.user);

      toast.success("Account created with Google 🚀");

      if (res.data.user.role === "provider") {
        navigate("/provider", { replace: true });
      } else if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error: any) {
      console.error("Google Sign Up Error:", error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Google sign up failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
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
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding & Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              Start Your Journey With Us
            </h1>
            <p className="text-white/80 text-lg">
              Join thousands of satisfied customers and service providers on India's most trusted home services platform.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Verified & Background Checked Professionals" },
              { icon: Clock, text: "Same Day Service Available" },
              { icon: Award, text: "Quality Workmanship Guaranteed" },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-white/70 text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-white/70 text-sm">Verified Providers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-white/70 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <span className="text-xl font-bold text-gray-900">ServexaGo</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">Join us and start your journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field with Strength Checker */}
              <PasswordStrengthChecker
                password={form.password}
                onPasswordChange={(password) => setForm({ ...form, password })}
                onStrengthChange={(_strength, isValid) => setIsPasswordValid(isValid)}
                label="Password"
                placeholder="Create a strong password"
                required
              />

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: option.value, servicesOffered: [] })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                        form.role === option.value
                          ? "border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-sm bg-white"
                      }`}
                    >
                      {form.role === option.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{option.icon}</div>
                      <div className={`font-semibold text-sm mb-1 ${form.role === option.value ? "text-indigo-700" : "text-gray-700"}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
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
                  
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !form.servicesOffered?.includes(value)) {
                          toggleService(value);
                        }
                        e.target.value = "";
                      }}
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
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
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

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
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    agreedToTerms 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'border-gray-300 hover:border-indigo-400 bg-white'
                  }`}
                >
                  {agreedToTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  disabled={loading || !agreedToTerms || !isPasswordValid}
                  className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                {!isPasswordValid && form.password && (
                  <p className="text-xs text-red-500 mt-3 text-center bg-red-50 py-2 rounded-lg">
                    Please create a stronger password to continue
                  </p>
                )}
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t"></div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
                Sign in
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Award className="w-4 h-4" />
              <span>Trusted</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
