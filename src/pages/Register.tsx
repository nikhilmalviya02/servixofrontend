import { useState } from "react";
import axios, { type AxiosError } from "axios";
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
import { useAuth } from "../context/AuthContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      GoogleAuthProvider.credentialFromResult(result);
      const token = await firebaseUser.getIdToken();

      const res = await axios.post(
        "https://servixobackend.vercel.app/api/auth/google",
        { token, role: form.role }
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
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      const axiosError = error as AxiosError<{ message: string; error: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || (error as Error)?.message || "Google sign up failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://servixobackend.vercel.app/api/auth/register", form);
      toast.success("Registered successfully 🎉");
      navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Registration failed");
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side - Branding & Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black/20"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-register" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-register)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Start Your Journey With Us
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
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
              <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
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
              <p className="text-4xl font-bold mb-1">10K+</p>
              <p className="text-white/80 text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">500+</p>
              <p className="text-white/80 text-sm">Verified Providers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1">4.9</p>
              <p className="text-white/80 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md animate-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your journey today</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
            {/* Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join us and start your journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="input-modern pl-10"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="input-modern pl-10"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field with Strength Checker */}
              <div className="space-y-2">
                <PasswordStrengthChecker
                  password={form.password}
                  onPasswordChange={(password) => setForm({ ...form, password })}
                  onStrengthChange={(_strength, isValid) => setIsPasswordValid(isValid)}
                  label="Password"
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  I want to
                </label>
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
                <div className="space-y-3 animate-in">
                  <label className="text-sm font-semibold text-gray-700">
                    Which services do you want to offer? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500">Select at least one service category</p>
                  
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !form.servicesOffered?.includes(value)) {
                          toggleService(value);
                        }
                        e.target.value = "";
                      }}
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer transition-all duration-200"
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
                  className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
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
            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                Continue with Google
              </span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
                Sign in
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-1.5 text-xs group">
              <ShieldCheck className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
              <span className="group-hover:text-gray-600 transition-colors">Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs group">
              <Award className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
              <span className="group-hover:text-gray-600 transition-colors">Trusted</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs group">
              <Clock className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
              <span className="group-hover:text-gray-600 transition-colors">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
