import { useState, useContext, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, ShieldCheck, Star, Users } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

/* ─── Dark theme styles ─── */
const LOGIN_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-surface2: #1a1a26;
    --sg-accent: #ff6b35;
    --sg-cyan: #00d4ff;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
    --sg-glow: rgba(255,107,53,0.25);
  }

  .lg-root {
    min-height: 100vh;
    display: flex;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  /* ── LEFT — form side ── */
  .lg-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.5rem;
    position: relative;
    z-index: 1;
  }

  /* subtle mesh behind form */
  .lg-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(255,107,53,.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 10%, rgba(0,212,255,.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .lg-wrap { width: 100%; max-width: 420px; }

  /* brand */
  .lg-brand {
    display: flex; align-items: center; gap: .55rem;
    margin-bottom: 2.2rem;
  }
  .lg-brand-icon {
    width: 44px; height: 44px; border-radius: 14px;
    background: rgba(255,107,53,.15);
    border: 1px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
  }
  .lg-brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.4rem;
    letter-spacing: -.4px; color: var(--sg-text);
    text-decoration: none;
  }
  .lg-brand-name span { color: var(--sg-accent); }

  /* heading */
  .lg-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 800; letter-spacing: -1px;
    line-height: 1.1; color: var(--sg-text);
    margin-bottom: .5rem;
  }
  .lg-heading em {
    font-style: normal;
    -webkit-text-stroke: 1.5px var(--sg-accent);
    color: transparent;
  }
  .lg-sub { color: var(--sg-muted); font-size: .92rem; font-weight: 300; margin-bottom: 2rem; }

  /* card */
  .lg-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 2rem 1.8rem;
  }

  /* fields */
  .lg-field { margin-bottom: 1.1rem; }
  .lg-label {
    display: block;
    font-size: .72rem; font-weight: 600;
    color: var(--sg-muted); letter-spacing: .6px;
    text-transform: uppercase; margin-bottom: .42rem;
  }
  .lg-input-wrap { position: relative; }
  .lg-input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--sg-muted); pointer-events: none;
    transition: color .2s;
  }
  .lg-input-wrap:focus-within .lg-input-icon { color: var(--sg-accent); }

  .lg-input {
    width: 100%;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 12px;
    padding: .76rem .9rem .76rem 2.6rem;
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    font-size: .92rem;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .lg-input::placeholder { color: var(--sg-muted); }
  .lg-input:focus {
    border-color: rgba(255,107,53,.5);
    box-shadow: 0 0 0 3px rgba(255,107,53,.1);
  }
  .lg-input.pr { padding-right: 2.8rem; }

  .lg-eye {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--sg-muted); padding: 0;
    display: flex; transition: color .2s;
  }
  .lg-eye:hover { color: var(--sg-text); }

  /* forgot */
  .lg-forgot {
    display: flex; justify-content: flex-end;
    margin-top: -.5rem; margin-bottom: 1rem;
  }
  .lg-forgot a {
    font-size: .78rem; color: var(--sg-accent);
    text-decoration: none; font-weight: 500;
    transition: opacity .2s;
  }
  .lg-forgot a:hover { opacity: .75; }

  /* submit */
  .lg-submit {
    width: 100%;
    background: var(--sg-accent);
    color: #fff; border: none; border-radius: 12px;
    padding: .9rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 24px var(--sg-glow);
  }
  .lg-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 32px rgba(255,107,53,.45);
  }
  .lg-submit:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; transform: none; }

  /* divider */
  .lg-divider {
    display: flex; align-items: center; gap: .9rem; margin: 1.4rem 0;
  }
  .lg-divider-line { flex:1; height:1px; background: var(--sg-border); }
  .lg-divider span { font-size: .7rem; color: var(--sg-muted); letter-spacing: 1px; white-space: nowrap; }

  /* google */
  .lg-google {
    width: 100%;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 12px; padding: .82rem;
    display: flex; align-items: center; justify-content: center; gap: .75rem;
    color: var(--sg-text); font-family:'DM Sans',sans-serif;
    font-weight: 500; font-size: .92rem; cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .lg-google:hover { border-color: rgba(255,255,255,.14); background: rgba(255,255,255,.05); }

  /* register link */
  .lg-register {
    text-align: center; margin-top: 1.4rem;
    font-size: .85rem; color: var(--sg-muted);
  }
  .lg-register a {
    color: var(--sg-accent); font-weight: 600;
    text-decoration: none; margin-left: .25rem;
  }
  .lg-register a:hover { text-decoration: underline; }

  /* ── RIGHT — visual side ── */
  .lg-right {
    display: none;
    position: relative; overflow: hidden;
    background: var(--sg-surface);
    border-left: 1px solid var(--sg-border);
  }
  @media(min-width:1024px){ .lg-right { display:flex; width:46%; } }

  /* dot grid */
  .lg-right-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.055) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  .lg-right-mesh {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 65% 55% at 70% 25%, rgba(255,107,53,.16) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(0,212,255,.09) 0%, transparent 60%);
    pointer-events: none;
  }

  .lg-right-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 3.5rem;
    width: 100%;
  }

  .lg-right-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.9rem, 2.8vw, 2.8rem);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -1.5px; color: var(--sg-text);
    margin-bottom: .8rem;
  }
  .lg-right-title em {
    font-style: normal;
    -webkit-text-stroke: 1.5px var(--sg-accent);
    color: transparent;
  }
  .lg-right-sub {
    color: var(--sg-muted); font-size: .95rem;
    font-weight: 300; line-height: 1.7;
    max-width: 320px; margin-bottom: 2.5rem;
  }

  /* service preview cards */
  .lg-preview-stack { width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: .7rem; }

  .lg-preview-card {
    background: rgba(255,255,255,.04);
    border: 1px solid var(--sg-border);
    border-radius: 16px; padding: 1rem 1.2rem;
    display: flex; align-items: center; gap: .9rem;
    transition: border-color .2s, background .2s;
  }
  .lg-preview-card:hover { border-color: rgba(255,107,53,.2); background: rgba(255,107,53,.05); }

  .lg-preview-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .lg-preview-body { flex: 1; }
  .lg-preview-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.88rem; color:var(--sg-text); }
  .lg-preview-meta  { font-size:.73rem; color:var(--sg-muted); margin-top:.15rem; }

  .lg-preview-badge {
    font-size:.65rem; font-weight:600; padding:.18rem .55rem;
    border-radius:100px; white-space:nowrap;
  }

  /* stars row */
  .lg-stars-row {
    display: flex; align-items: center; gap: .35rem;
    margin-top: 2rem;
  }
  .lg-star { color: #ffbe0b; font-size: .85rem; }
  .lg-stars-text { font-size:.8rem; color:var(--sg-muted); margin-left:.3rem; }
  .lg-stars-text strong { color:var(--sg-text); font-weight:600; }

  /* pill badges row */
  .lg-pills { display:flex; gap:.6rem; flex-wrap:wrap; margin-top:1.8rem; }
  .lg-pill {
    display:flex; align-items:center; gap:.4rem;
    background:rgba(255,255,255,.05); border:1px solid var(--sg-border);
    border-radius:100px; padding:.3rem .85rem;
    font-size:.75rem; color:var(--sg-muted);
  }
  .lg-pill svg { flex-shrink:0; }
`;

function InjectLoginStyle() {
  useEffect(() => {
    if (!document.getElementById("lg-style")) {
      const el = document.createElement("style");
      el.id = "lg-style";
      el.textContent = LOGIN_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function Login() {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext not found");
  const { login, user } = authContext;

  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) {
      const role = localStorage.getItem("role");
      if (role === "provider") navigate("/provider", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else navigate("/home", { replace: true });
    }
  }, [user, navigate]);

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
      if (res.data.user.role === "provider") navigate("/provider", { replace: true });
      else if (res.data.user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/home", { replace: true });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token  = await result.user.getIdToken();
      const res    = await axios.post(
        "https://servixobackend.vercel.app/api/auth/google",
        { token }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.token, res.data.user);
      toast.success("Logged in with Google 🚀");
      if (res.data.user.role === "provider") navigate("/provider", { replace: true });
      else if (res.data.user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/home", { replace: true });
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.message || "Google login failed");
    }
  };

  if (user) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--sg-bg)", color:"var(--sg-muted)", fontFamily:"'DM Sans',sans-serif" }}>
        Loading…
      </div>
    );
  }

  const previewCards = [
    { icon: "🧹", label: "Home Cleaning",  meta: "2BHK Deep Clean",   badge: "TODAY",   badgeBg: "rgba(255,107,53,.15)",  badgeColor: "#ff6b35" },
    { icon: "⚡", label: "Electrician",    meta: "Fan Installation",   badge: "11:00 AM", badgeBg: "rgba(0,212,255,.12)",   badgeColor: "#00d4ff" },
    { icon: "🔧", label: "Plumbing",        meta: "Pipe Leak Fix",      badge: "DONE ✓",  badgeBg: "rgba(74,222,128,.12)",  badgeColor: "#4ade80" },
  ];

  return (
    <>
      <InjectLoginStyle />
      <div className="lg-root">

        {/* ── LEFT — form ── */}
        <div className="lg-left">
          <div className="lg-wrap">

            {/* heading */}
            <h1 className="lg-heading">Welcome<br /><em>Back!</em></h1>
            <p className="lg-sub">Sign in to your account to continue booking trusted services.</p>

            <div className="lg-card">
              <form onSubmit={handleLogin}>

                {/* Email */}
                <div className="lg-field">
                  <label className="lg-label">Email Address</label>
                  <div className="lg-input-wrap">
                    <Mail size={16} className="lg-input-icon" />
                    <input
                      type="email" required
                      placeholder="name@example.com"
                      className="lg-input"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lg-field">
                  <label className="lg-label">Password</label>
                  <div className="lg-input-wrap">
                    <Lock size={16} className="lg-input-icon" />
                    <input
                      type={show ? "text" : "password"} required
                      placeholder="Enter your password"
                      className="lg-input pr"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="lg-eye" onClick={() => setShow(!show)} aria-label="Toggle password">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="lg-forgot">
                  <a href="#">Forgot password?</a>
                </div>

                {/* Submit */}
                <button type="submit" className="lg-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".75"/>
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <> Sign In <ArrowRight size={17} /> </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="lg-divider">
                <div className="lg-divider-line" />
                <span>OR CONTINUE WITH</span>
                <div className="lg-divider-line" />
              </div>

              {/* Google */}
              <button className="lg-google" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Register link */}
              <p className="lg-register">
                Don't have an account?
                <Link to="/register">Create account</Link>
              </p>
            </div>

          </div>
        </div>

        {/* ── RIGHT — visual ── */}
        <div className="lg-right">
          <div className="lg-right-grid" />
          <div className="lg-right-mesh" />
          <div className="lg-right-content">

            <h2 className="lg-right-title">
              Book Trusted<br /><em>Services</em><br />Near You
            </h2>
            <p className="lg-right-sub">
              Connect with verified professionals for home repairs, cleaning, beauty, and more — right at your doorstep.
            </p>

            {/* service preview cards */}
            <div className="lg-preview-stack">
              {previewCards.map((c) => (
                <div key={c.label} className="lg-preview-card">
                  <div
                    className="lg-preview-icon"
                    style={{ background: c.badgeBg }}
                  >
                    {c.icon}
                  </div>
                  <div className="lg-preview-body">
                    <div className="lg-preview-title">{c.label}</div>
                    <div className="lg-preview-meta">{c.meta}</div>
                  </div>
                  <span
                    className="lg-preview-badge"
                    style={{ background: c.badgeBg, color: c.badgeColor }}
                  >
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* star rating */}
            <div className="lg-stars-row">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="lg-star">{s}</span>
              ))}
              <span className="lg-stars-text">
                <strong>4.9</strong> from 10,000+ happy customers
              </span>
            </div>

            {/* pill badges */}
            <div className="lg-pills">
              <div className="lg-pill">
                <ShieldCheck size={12} style={{ color:"#4ade80" }} />
                Verified Providers
              </div>
              <div className="lg-pill">
                <Users size={12} style={{ color:"#00d4ff" }} />
                10K+ Customers
              </div>
              <div className="lg-pill">
                <Star size={12} style={{ color:"#ffbe0b" }} />
                Secure Payments
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Login;