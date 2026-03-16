import { useState, useContext, useEffect } from "react";

import axios, { AxiosError } from "axios";

import { AuthContext } from "../context/AuthContext";

import toast from "react-hot-toast";

import { useNavigate, Link } from "react-router-dom";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../firebase";



function Login() {



  const authContext = useContext(AuthContext);



  if (!authContext) {

    throw new Error("AuthContext not found");

  }



  const { login, user } = authContext;



  const navigate = useNavigate();



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    if (user) {

      const role = localStorage.getItem("role");



      if (role === "provider") {

        navigate("/provider", { replace: true });

      } else if (role === "admin") {

        navigate("/admin", { replace: true });

      } else {

        navigate("/home", { replace: true });

      }

    }

  }, [user, navigate]);



  // Normal Login

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setLoading(true);



    try {



      const res = await axios.post(

        "https://servixobackend.vercel.app/api/auth/login",

        { email, password }

      );



      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.user.role);

      localStorage.setItem("user", JSON.stringify(res.data.user));



      login(res.data.token, res.data.user);



      toast.success("Welcome back 🎉");



      if (res.data.user.role === "provider") {

        navigate("/provider", { replace: true });

      } else if (res.data.user.role === "admin") {

        navigate("/admin", { replace: true });

      } else {

        navigate("/home", { replace: true });

      }



    } catch (error) {



      const err = error as AxiosError<{ message: string }>;



      toast.error(err.response?.data?.message || "Login failed");



    } finally {

      setLoading(false);

    }

  };



  // Google Login

  const handleGoogleLogin = async () => {

    try {



      const result = await signInWithPopup(auth, provider);



      const firebaseUser = result.user;



      const token = await firebaseUser.getIdToken();



      const res = await axios.post(

        "https://servixobackend.vercel.app/api/auth/google",

        { token }

      );



      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.user.role);

      localStorage.setItem("user", JSON.stringify(res.data.user));



      login(res.data.token, res.data.user);



      toast.success("Logged in with Google 🚀");



      if (res.data.user.role === "provider") {

        navigate("/provider", { replace: true });

      } else if (res.data.user.role === "admin") {

        navigate("/admin", { replace: true });

      } else {

        navigate("/home", { replace: true });

      }



    } catch (error) {



      const err = error as AxiosError;



      toast.error(err.message || "Google login failed");



    }

  };



  if (user) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }



  return (

    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">



      {/* Left Side */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">



        <div className="w-full max-w-md animate-in">



          {/* Logo/Brand Section */}

          <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">

              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

              </svg>

            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">

              Welcome back

            </h1>

            <p className="text-gray-600">

              Sign in to your account to continue

            </p>

          </div>



          <form onSubmit={handleLogin} className="space-y-5">



            {/* Email */}

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

                  onChange={(e) => setEmail(e.target.value)}

                />



              </div>



            </div>



            {/* Password */}

            <div className="space-y-2">



              <label className="text-sm font-semibold text-gray-700">

                Password

              </label>



              <div className="relative group">



                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />



                <input

                  type={show ? "text" : "password"}

                  required

                  placeholder="Enter your password"

                  className="input-modern pl-10 pr-10"

                  onChange={(e) => setPassword(e.target.value)}

                />



                <button

                  type="button"

                  onClick={() => setShow(!show)}

                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-indigo-500 transition-colors duration-200"

                  aria-label={show ? "Hide password" : "Show password"}

                >

                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}

                </button>



              </div>



            </div>



            <button

              type="submit"

              disabled={loading}

              className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"

            >



              {loading ? (

                <>

                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

                  </svg>

                  Signing in...

                </>

              ) : (

                <>

                  Sign In

                  <ArrowRight className="w-5 h-5" />

                </>

              )}



            </button>



          </form>



          {/* Divider */}

          <div className="flex items-center my-8">

            <div className="flex-grow border-t border-gray-200"></div>

            <span className="mx-4 text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>

            <div className="flex-grow border-t border-gray-200"></div>

          </div>



          {/* Google Login */}

          <button

            onClick={handleGoogleLogin}

            className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"

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



          <p className="text-center mt-8 text-gray-600">



            Don't have an account?



            <Link

              to="/register"

              className="text-indigo-600 ml-1 font-semibold hover:text-indigo-700 transition-colors duration-200"

            >

              Create account

            </Link>



          </p>



        </div>



      </div>



      {/* Right Side */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 items-center justify-center text-white relative overflow-hidden">



        {/* Background Pattern */}

        <div className="absolute inset-0 opacity-10">

          <div className="absolute inset-0 bg-black/20"></div>

          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">

            <defs>

              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">

                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>

              </pattern>

            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

          </svg>

        </div>



        <div className="text-center relative z-10 px-12">



          <div className="mb-8">

            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">

              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />

              </svg>

            </div>

          </div>



          <h2 className="text-4xl font-bold mb-6 leading-tight">

            Book Trusted Services

          </h2>



          <p className="text-lg text-white/90 mb-8 leading-relaxed">

            Join thousands of happy customers using ServexaGo to connect with verified service providers

          </p>



          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">

              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">

                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />

              </svg>

              <span className="text-sm font-medium">Verified Providers</span>

            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">

              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">

                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />

              </svg>

              <span className="text-sm font-medium">Secure Payments</span>

            </div>

          </div>



        </div>



      </div>



    </div>

  );

}



export default Login;