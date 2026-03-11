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
    <div className="min-h-screen flex bg-white">

      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold mb-6">
            Welcome back
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>

              <label>Email</label>

              <div className="relative">

                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

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
            <div>

              <label>Password</label>

              <div className="relative">

                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                <input
                  type={show ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  className="input-modern pl-10 pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3"
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >

              {loading ? "Loading..." : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}

            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50"
          >

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />

            Continue with Google

          </button>

          <p className="text-center mt-6">

            Don't have an account?

            <Link
              to="/register"
              className="text-indigo-600 ml-1"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center text-white">

        <div className="text-center">

          <h2 className="text-4xl font-bold mb-6">
            Book Trusted Services
          </h2>

          <p className="text-lg text-white/80">
            Join thousands of happy customers using ServexaGo
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;