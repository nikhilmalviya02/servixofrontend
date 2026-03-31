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
  ChevronRight,
} from "lucide-react";
import PasswordStrengthChecker from "../components/PasswordStrengthChecker";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useEffect } from "react";

/* ─── Inject light theme styles ─── */
const REGISTER_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --sg-bg: #ffffff;
    --sg-surface: #f8fafc;
    --sg-surface2: #f1f5f9;
    --sg-accent: #3b82f6;
    --sg-accent2: #0ea5e9;
    --sg-cyan: #06b6d4;
    --sg-text: #1e293b;
    --sg-muted: #64748b;
    --sg-border: rgba(0,0,0,0.08);
    --sg-glow: rgba(59,130,246,0.15);
  }

  .rg-root {
    min-height: 100vh;
    display: flex;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* ── left panel ── */
  .rg-left {
    display: none;
    position: relative;
    overflow: hidden;
    background: var(--sg-surface);
    border-right: 1px solid var(--sg-border);
  }
  @media(min-width:1024px){ .rg-left { display:flex; width:42%; } }

  .rg-left-mesh {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 30% 30%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 80% 80%, rgba(6,182,212,.05) 0%, transparent 60%);
    pointer-events: none;
  }

  /* grid dots */
  .rg-left-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .rg-left-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 3.5rem;
    width: 100%;
  }

  .rg-brand {
    font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: 1.7rem;
    letter-spacing: -.5px;
    color: var(--sg-text);
    text-decoration: none;
    margin-bottom: 2.5rem;
    display: inline-block;
  }
  .rg-brand span { color: var(--sg-accent); }

  .rg-left-title {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1.7rem, 2.8vw, 2.4rem);
    font-weight: 800; line-height: 1.15;
    letter-spacing: -1px;
    color: var(--sg-text);
    margin-bottom: .8rem;
  }
  .rg-left-title em {
    font-style: normal;
    color: var(--sg-text);
  }
  .rg-left-sub {
    color: var(--sg-muted); font-size: .95rem;
    font-weight: 300; line-height: 1.7;
    margin-bottom: 2.5rem; max-width: 340px;
  }

  /* benefit rows */
  .rg-benefit {
    display: flex; align-items: center; gap: .9rem;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--sg-border);
    border-radius: 14px;
    padding: .95rem 1.1rem;
    margin-bottom: .7rem;
    transition: background .2s, border-color .2s;
  }
  .rg-benefit:hover { background: rgba(59,130,246,.05); border-color: rgba(59,130,246,.2); }
  .rg-benefit-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rg-benefit span { font-size: .88rem; font-weight: 500; color: var(--sg-text); }

  /* left stats */
  .rg-stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1rem; margin-top: 2.5rem;
  }
  .rg-stat-num {
    font-family: 'Inter', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: var(--sg-text);
  }
  .rg-stat-num span { color: var(--sg-accent); }
  .rg-stat-label { font-size: .7rem; color: var(--sg-muted); margin-top: .2rem; letter-spacing: .5px; text-transform: uppercase; }

  /* ── right panel ── */
  .rg-right {
    flex: 1; display: flex;
    align-items: center; justify-content: center;
    padding: 2rem 1.5rem;
    overflow-y: auto;
  }

  .rg-card-wrap { width: 100%; max-width: 440px; }

  /* mobile brand */
  .rg-mobile-brand {
    text-align: center; margin-bottom: 1.8rem;
  }
  .rg-mobile-logo {
    width: 52px; height: 52px; border-radius: 16px;
    background: rgba(255,107,53,.15); border: 1px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto .8rem;
  }
  .rg-mobile-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: 1.4rem; color: var(--sg-text);
  }
  .rg-mobile-sub { color: var(--sg-muted); font-size: .88rem; margin-top: .25rem; }

  /* card */
  .rg-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 24px;
    padding: 2rem 1.8rem;
  }

  .rg-card-header { text-align: center; margin-bottom: 1.8rem; }
  .rg-card-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: 1.6rem;
    color: var(--sg-text); letter-spacing: -.5px;
  }
  .rg-card-sub { color: var(--sg-muted); font-size: .88rem; margin-top: .25rem; }

  /* input */
  .rg-field { margin-bottom: 1.1rem; }
  .rg-label {
    display: block; font-size: .78rem; font-weight: 600;
    color: var(--sg-muted); letter-spacing: .5px; text-transform: uppercase;
    margin-bottom: .45rem;
  }
  .rg-input-wrap { position: relative; }
  .rg-input-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: var(--sg-muted); pointer-events: none;
    transition: color .2s;
  }
  .rg-input-wrap:focus-within .rg-input-icon { color: var(--sg-accent); }

  .rg-input {
    width: 100%;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 12px;
    padding: .75rem .9rem .75rem 2.6rem;
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    font-size: .92rem;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .rg-input::placeholder { color: var(--sg-muted); }
  .rg-input:focus {
    border-color: rgba(255,107,53,.5);
    box-shadow: 0 0 0 3px rgba(255,107,53,.1);
  }

  /* role selector */
  .rg-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
  .rg-role-btn {
    position: relative;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 14px; padding: 1rem .9rem;
    cursor: pointer; text-align: left;
    transition: border-color .25s, background .25s, transform .2s;
  }
  .rg-role-btn:hover { border-color: rgba(59,130,246,.25); transform: translateY(-1px); }
  .rg-role-btn.active {
    border-color: var(--sg-accent);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 1px rgba(59,130,246,.2);
  }
  .rg-role-check {
    position: absolute; top: 8px; right: 8px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--sg-accent);
    display: flex; align-items: center; justify-content: center;
  }
  .rg-role-icon { font-size: 1.5rem; margin-bottom: .4rem; display: block; }
  .rg-role-name { font-family:'Inter',sans-serif; font-weight:700; font-size:.85rem; color: var(--sg-text); }
  .rg-role-desc { font-size:.72rem; color:var(--sg-muted); margin-top:.15rem; }

  /* services dropdown */
  .rg-select {
    width: 100%;
    background: var(--sg-surface2);
    border: 2px solid var(--sg-border);
    border-radius: 16px;
    padding: .85rem 3rem .85rem 1rem;
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    font-size: .9rem;
    font-weight: 500;
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: all .3s ease;
    position: relative;
  }
  .rg-select:hover {
    border-color: rgba(59,130,246,.3);
    background: rgba(59,130,246,.02);
  }
  .rg-select:focus {
    border-color: var(--sg-accent);
    box-shadow: 0 0 0 4px rgba(59,130,246,.1);
    background: var(--sg-bg);
  }
  .rg-select option {
    background: var(--sg-bg);
    color: var(--sg-text);
    padding: .75rem;
    font-weight: 500;
  }

  /* service tags */
  .rg-tags { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .7rem; }
  .rg-tag {
    display: inline-flex; align-items: center; gap: .35rem;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.2);
    color: var(--sg-accent);
    border-radius: 100px; padding: .25rem .7rem;
    font-size: .78rem; font-weight: 500;
  }
  .rg-tag-remove {
    background: none; border: none; cursor: pointer;
    color: var(--sg-accent); display: flex;
    align-items: center; padding: 0; margin-left: .15rem;
    opacity: .7; transition: opacity .15s;
  }
  .rg-tag-remove:hover { opacity: 1; }

  /* terms */
  .rg-terms {
    display: flex; align-items: flex-start; gap: .75rem;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--sg-border);
    border-radius: 12px; padding: .85rem;
  }
  .rg-checkbox {
    width: 20px; height: 20px; border-radius: 7px;
    border: 1.5px solid var(--sg-border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; margin-top: 1px;
    transition: background .2s, border-color .2s;
    background: var(--sg-surface2);
  }
  .rg-checkbox.checked {
    background: var(--sg-accent);
    border-color: var(--sg-accent);
  }
  .rg-terms p { font-size: .83rem; color: var(--sg-muted); line-height: 1.5; }
  .rg-terms a { color: var(--sg-accent); text-decoration: none; font-weight: 500; }
  .rg-terms a:hover { text-decoration: underline; }

  /* submit */
  .rg-submit {
    width: 100%; margin-top: 1.2rem;
    background: var(--sg-accent);
    color: #fff; border: none; border-radius: 12px;
    padding: .9rem; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    transition: transform .2s, box-shadow .2s, background .2s;
    box-shadow: 0 0 24px var(--sg-glow);
  }
  .rg-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 32px rgba(59,130,246,.35); }
  .rg-submit:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; transform: none; }

  .rg-pw-error {
    font-size: .75rem; color: #ff6b6b;
    background: rgba(255,107,107,.1); border-radius: 8px;
    padding: .4rem .75rem; margin-top: .6rem; text-align: center;
  }

  /* divider */
  .rg-divider {
    display: flex; align-items: center; gap: .9rem;
    margin: 1.4rem 0;
  }
  .rg-divider-line { flex:1; height:1px; background:var(--sg-border); }
  .rg-divider span { font-size: .72rem; color: var(--sg-muted); letter-spacing: 1px; white-space: nowrap; }

  /* google btn */
  .rg-google {
    width: 100%;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 12px; padding: .82rem;
    display: flex; align-items: center; justify-content: center; gap: .75rem;
    color: var(--sg-text); font-family:'DM Sans',sans-serif;
    font-weight: 500; font-size: .92rem; cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .rg-google:hover:not(:disabled) { border-color: rgba(59,130,246,.25); background: rgba(59,130,246,.05); }
  .rg-google:disabled { opacity: .4; cursor: not-allowed; }

  /* login link */
  .rg-login-link {
    text-align: center; margin-top: 1.4rem;
    font-size: .85rem; color: var(--sg-muted);
  }
  .rg-login-link a {
    color: var(--sg-accent); text-decoration: none; font-weight: 600;
    display: inline-flex; align-items: center; gap: .2rem;
  }
  .rg-login-link a:hover { text-decoration: underline; }

  /* trust strip below card */
  .rg-trust {
    display: flex; justify-content: center; gap: 1.8rem;
    margin-top: 1.4rem; flex-wrap: wrap;
  }
  .rg-trust-item {
    display: flex; align-items: center; gap: .4rem;
    font-size: .75rem; color: var(--sg-muted);
  }
`;

function InjectRegisterStyle() {
  useEffect(() => {
    if (!document.getElementById("rg-style")) {
      const el = document.createElement("style");
      el.id = "rg-style";
      el.textContent = REGISTER_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════
   COMPONENT
═══════════════════════════════════ */
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

  /* Google Sign Up */
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
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

      if (res.data.user.role === "provider") navigate("/provider", { replace: true });
      else if (res.data.user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/home", { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string; error: string }>;
      toast.error(
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error as Error)?.message ||
        "Google sign up failed"
      );
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
    { value: "user",     label: "Customer",         icon: "👤", desc: "Book services" },
    { value: "provider", label: "Service Provider",  icon: "🛠️", desc: "Offer services" },
  ];

  const serviceCategories = [
    { name: "Cleaning",         icon: "🧹" },
    { name: "Plumbing",         icon: "🔧" },
    { name: "Electrical",       icon: "⚡" },
    { name: "AC & Appliances",  icon: "❄️" },
    { name: "Painting",         icon: "🎨" },
    { name: "Gardening",        icon: "🪴" },
    { name: "Vehicle Care",     icon: "🚗" },
    { name: "Carpentry",        icon: "🔨" },
    { name: "Pest Control",     icon: "🐜" },
    { name: "Home Security",    icon: "🔒" },
    { name: "Interior Design",  icon: "🏠" },
    { name: "Moving & Packing", icon: "📦" },
  ];

  const toggleService = (name: string) => {
    setForm((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(name)
        ? prev.servicesOffered.filter((s) => s !== name)
        : [...prev.servicesOffered, name],
    }));
  };

  return (
    <>
      <InjectRegisterStyle />
      <div className="rg-root">

        {/* ── LEFT PANEL ── */}
        <div className="rg-left">
          <div className="rg-left-mesh" />
          <div className="rg-left-grid" />
          <div className="rg-left-content">

            <h1 className="rg-left-title">
              Start Your<br /><em>Journey</em><br />With Us
            </h1>
            <p className="rg-left-sub">
              Join thousands of satisfied customers and service providers on India's most trusted home services platform.
            </p>

            {[
              { icon: ShieldCheck, label: "Verified & Background Checked Professionals", color: "#ff6b35" },
              { icon: Clock,       label: "Same Day Service Available",                  color: "#00d4ff" },
              { icon: Award,       label: "Quality Workmanship Guaranteed",              color: "#ffbe0b" },
            ].map((b) => (
              <div key={b.label} className="rg-benefit">
                <div className="rg-benefit-icon" style={{ background: `${b.color}18` }}>
                  <b.icon size={18} style={{ color: b.color }} />
                </div>
                <span>{b.label}</span>
              </div>
            ))}

            <div className="rg-stats">
              {[
                { num: "10K", sup: "+", label: "Happy Customers" },
                { num: "500", sup: "+", label: "Verified Providers" },
                { num: "4.9", sup: "★", label: "Avg Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="rg-stat-num">{s.num}<span>{s.sup}</span></div>
                  <div className="rg-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rg-right">
          <div className="rg-card-wrap">

            {/* mobile branding */}
            <div className="rg-mobile-brand" style={{ display: "block" }}
              // hide on lg via inline — left panel handles branding on large screens
            >
              
              <div className="rg-mobile-title">Servexa<span style={{ color: "#3b82f6" }}>Go</span></div>
              <div className="rg-mobile-sub">Create your free account</div>
            </div>

            <div className="rg-card">
              {/* card header — shown only lg+ */}
              <div className="rg-card-header" style={{ display: "none" }} id="rg-desk-header">
                <div className="rg-card-title">Create Account</div>
                <div className="rg-card-sub">Join us and start your journey today</div>
              </div>

              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="rg-field">
                  <label className="rg-label">Full Name</label>
                  <div className="rg-input-wrap">
                    <User size={16} className="rg-input-icon" />
                    <input
                      type="text" required placeholder="John Doe"
                      className="rg-input"
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="rg-field">
                  <label className="rg-label">Email Address</label>
                  <div className="rg-input-wrap">
                    <Mail size={16} className="rg-input-icon" />
                    <input
                      type="email" required placeholder="name@example.com"
                      className="rg-input"
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="rg-field">
                  {/* PasswordStrengthChecker — pass dark-mode class or wrap */}
                  <PasswordStrengthChecker
                    password={form.password}
                    onPasswordChange={(password) => setForm({ ...form, password })}
                    onStrengthChange={(_s, isValid) => setIsPasswordValid(isValid)}
                    label="Password"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                {/* Role */}
                <div className="rg-field">
                  <label className="rg-label">I want to</label>
                  <div className="rg-role-grid">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`rg-role-btn ${form.role === opt.value ? "active" : ""}`}
                        onClick={() => setForm({ ...form, role: opt.value, servicesOffered: [] })}
                      >
                        {form.role === opt.value && (
                          <div className="rg-role-check">
                            <CheckCircle size={11} color="#fff" />
                          </div>
                        )}
                        <span className="rg-role-icon">{opt.icon}</span>
                        <div className="rg-role-name">{opt.label}</div>
                        <div className="rg-role-desc">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services (provider only) */}
                {form.role === "provider" && (
                  <div className="rg-field">
                    <label className="rg-label">
                      Services You Offer <span style={{ color: "#ff6b6b" }}>*</span>
                    </label>
                    <p style={{ fontSize: ".72rem", color: "var(--sg-muted)", marginBottom: ".45rem" }}>
                      Select at least one category
                    </p>
                    <div style={{ position: "relative" }}>
                      <select
                        className="rg-select"
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v && !form.servicesOffered.includes(v)) toggleService(v);
                          e.target.value = "";
                        }}
                      >
                        <option value="">-- Select a service --</option>
                        {serviceCategories.map((s) => (
                          <option
                            key={s.name} value={s.name}
                            disabled={form.servicesOffered.includes(s.name)}
                          >
                            {s.icon} {s.name}{form.servicesOffered.includes(s.name) ? " ✓" : ""}
                          </option>
                        ))}
                      </select>
                      <div style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--sg-muted)" }}>
                        <ChevronRight size={16} style={{ transform: "rotate(90deg)" }} />
                      </div>
                    </div>

                    {form.servicesOffered.length > 0 && (
                      <div className="rg-tags">
                        {form.servicesOffered.map((name) => {
                          const s = serviceCategories.find((x) => x.name === name);
                          return (
                            <span key={name} className="rg-tag">
                              {s?.icon} {name}
                              <button type="button" className="rg-tag-remove" onClick={() => toggleService(name)}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Terms */}
                <div className="rg-terms" style={{ marginBottom: "1rem" }}>
                  <div
                    className={`rg-checkbox ${agreedToTerms ? "checked" : ""}`}
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                  >
                    {agreedToTerms && <CheckCircle size={12} color="#fff" />}
                  </div>
                  <p>
                    I agree to the{" "}
                    <Link to="/terms">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="rg-submit"
                  disabled={loading || !agreedToTerms || !isPasswordValid}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".75"/>
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>Create Account <ArrowRight size={17} /></>
                  )}
                </button>

                {!isPasswordValid && form.password && (
                  <p className="rg-pw-error">Please create a stronger password to continue</p>
                )}
              </form>

              {/* Divider */}
              <div className="rg-divider">
                <div className="rg-divider-line" />
                <span>OR CONTINUE WITH</span>
                <div className="rg-divider-line" />
              </div>

              {/* Google */}
              <button className="rg-google" onClick={handleGoogleSignUp} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Login link */}
              <p className="rg-login-link">
                Already have an account?{" "}
                <Link to="/login">
                  Sign in <ChevronRight size={14} />
                </Link>
              </p>
            </div>

            {/* Trust strip */}
            <div className="rg-trust">
              {[
                { icon: ShieldCheck, label: "Secure", color: "#4ade80" },
                { icon: Award,       label: "Trusted", color: "#ff6b35" },
                { icon: Clock,       label: "24/7 Support", color: "#00d4ff" },
              ].map((t) => (
                <div key={t.label} className="rg-trust-item">
                  <t.icon size={14} style={{ color: t.color }} />
                  {t.label}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Register;