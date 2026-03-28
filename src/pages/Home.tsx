import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Star,
  ArrowRight,
  Clock,
  Award,
  Calendar,
  MapPin,
  Package,
  TrendingUp,
  Search,
  ChevronRight,
  HomeIcon,
} from "lucide-react";

/* ─── Dark theme styles ─── */
const HOME_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-surface2: #1a1a26;
    --sg-accent: #ff6b35;
    --sg-accent2: #ffbe0b;
    --sg-cyan: #00d4ff;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
    --sg-glow: rgba(255,107,53,0.22);
  }

  .hm-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── HERO / WELCOME ── */
  .hm-hero {
    position: relative;
    padding: 7rem 5% 5rem;
    overflow: hidden;
  }
  .hm-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 80% 30%, rgba(255,107,53,.14) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(0,212,255,.08) 0%, transparent 60%);
    pointer-events: none;
  }
  /* dot grid */
  .hm-hero::after {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
  }

  .hm-hero-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    display: flex; flex-direction: column;
    gap: 2.5rem;
  }

  @media(min-width:768px){
    .hm-hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
  }

  /* greeting */
  .hm-greet {
    display: inline-flex; align-items: center; gap: .5rem;
    background: rgba(255,107,53,.1);
    border: 1px solid rgba(255,107,53,.25);
    border-radius: 100px; padding: .32rem .9rem;
    font-size: .75rem; font-weight: 600;
    color: var(--sg-accent); margin-bottom: .8rem;
    letter-spacing: .3px;
  }
  .hm-greet::before { content: '●'; font-size: .4rem; animation: hm-pulse 1.5s ease infinite; }
  @keyframes hm-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .hm-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 800; letter-spacing: -1.5px;
    line-height: 1.1; color: var(--sg-text);
  }
  .hm-hero-title span { color: var(--sg-accent); }

  .hm-hero-sub {
    color: var(--sg-muted); font-size: .97rem;
    font-weight: 300; line-height: 1.7;
    max-width: 440px; margin-top: .6rem;
  }

  /* hero stat chips */
  .hm-stat-chips {
    display: flex; gap: .8rem; flex-wrap: wrap; margin-top: 1.5rem;
  }
  .hm-stat-chip {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 16px; padding: .9rem 1.4rem;
    text-align: center; min-width: 90px;
  }
  .hm-stat-chip-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem; font-weight: 800; color: var(--sg-text);
  }
  .hm-stat-chip-num span { color: var(--sg-accent); }
  .hm-stat-chip-label { font-size: .68rem; color: var(--sg-muted); margin-top: .15rem; letter-spacing: .4px; text-transform: uppercase; }

  /* ── SECTIONS COMMON ── */
  .hm-section { padding: 3.5rem 5%; max-width: 1280px; margin: 0 auto; }

  .hm-section-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.8rem;
  }
  .hm-section-tag {
    display: inline-block; font-size: .7rem; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--sg-accent); margin-bottom: .4rem;
  }
  .hm-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.35rem; font-weight: 800;
    letter-spacing: -.5px; color: var(--sg-text);
  }
  .hm-section-sub { color: var(--sg-muted); font-size: .82rem; margin-top: .2rem; }
  .hm-view-all {
    display: flex; align-items: center; gap: .3rem;
    color: var(--sg-accent); text-decoration: none;
    font-size: .83rem; font-weight: 600; white-space: nowrap;
    transition: gap .2s;
  }
  .hm-view-all:hover { gap: .55rem; }

  /* ── QUICK ACTIONS ── */
  .hm-qa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem; margin-top: -2rem; position: relative; z-index: 2;
    max-width: 1280px; margin-left: auto; margin-right: auto;
    padding: 0 5%;
  }
  .hm-qa-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 18px; padding: 1.3rem 1.1rem;
    text-decoration: none;
    transition: transform .25s, border-color .25s, box-shadow .25s;
    display: block;
  }
  .hm-qa-card:hover { transform: translateY(-4px); border-color: rgba(255,107,53,.25); box-shadow: 0 10px 30px rgba(0,0,0,.35); }
  .hm-qa-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: .85rem;
    transition: transform .2s;
  }
  .hm-qa-card:hover .hm-qa-icon { transform: scale(1.1); }
  .hm-qa-label { font-family:'Syne',sans-serif; font-weight:700; font-size:.88rem; color:var(--sg-text); }

  /* ── RECENT BOOKINGS ── */
  .hm-bk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 1rem; }
  .hm-bk-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 18px; padding: 1.3rem;
    transition: border-color .2s, box-shadow .2s;
  }
  .hm-bk-card:hover { border-color: rgba(255,107,53,.18); box-shadow: 0 6px 24px rgba(0,0,0,.3); }
  .hm-bk-top { display:flex; align-items:flex-start; justify-content:space-between; gap:.7rem; margin-bottom:.9rem; }
  .hm-bk-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,107,53,.1); border: 1px solid rgba(255,107,53,.2);
    display: flex; align-items: center; justify-content: center; flex-shrink:0;
  }
  .hm-bk-name { font-family:'Syne',sans-serif; font-weight:700; font-size:.92rem; color:var(--sg-text); }
  .hm-bk-date { font-size:.75rem; color:var(--sg-muted); margin-top:.15rem; }
  .hm-bk-addr { display:flex; align-items:center; gap:.4rem; font-size:.75rem; color:var(--sg-muted); margin-top:.6rem; }

  /* status badges */
  .hm-status {
    font-size:.67rem; font-weight:600; padding:.22rem .7rem;
    border-radius:100px; white-space:nowrap; text-transform:capitalize;
  }
  .hm-status-completed  { background:rgba(74,222,128,.12); color:#4ade80; }
  .hm-status-confirmed  { background:rgba(0,212,255,.12);  color:#00d4ff; }
  .hm-status-pending    { background:rgba(255,190,11,.12); color:#ffbe0b; }
  .hm-status-cancelled  { background:rgba(255,107,107,.12); color:#ff6b6b; }
  .hm-status-default    { background:rgba(255,255,255,.07); color:var(--sg-muted); }

  /* ── CATEGORIES ── */
  .hm-cat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .8rem;
  }
  @media(min-width:640px){ .hm-cat-grid { grid-template-columns: repeat(8,1fr); } }

  .hm-cat-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 16px; padding: .9rem .5rem;
    text-align: center; text-decoration: none;
    transition: transform .25s, border-color .25s;
    display: block;
  }
  .hm-cat-card:hover { transform: translateY(-3px); border-color: rgba(255,107,53,.22); }
  .hm-cat-icon {
    width: 44px; height: 44px; border-radius: 12px; margin: 0 auto .6rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.35rem;
    box-shadow: 0 4px 14px rgba(0,0,0,.3);
    transition: transform .2s;
  }
  .hm-cat-card:hover .hm-cat-icon { transform: scale(1.1); }
  .hm-cat-label { font-size:.7rem; font-weight:600; color:var(--sg-muted); }

  /* ── SERVICE CARDS ── */
  .hm-srv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
    gap: 1.1rem;
  }
  .hm-srv-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 20px; overflow: hidden;
    text-decoration: none;
    transition: transform .3s, border-color .3s, box-shadow .3s;
    display: block;
  }
  .hm-srv-card:hover { transform: translateY(-5px); border-color: rgba(255,107,53,.25); box-shadow: 0 12px 36px rgba(0,0,0,.4); }
  .hm-srv-img {
    height: 150px; position: relative;
    display: flex; align-items: center; justify-content: center; font-size: 4rem;
  }
  .hm-srv-img img { width:100%; height:100%; object-fit:cover; transition: transform .4s; }
  .hm-srv-card:hover .hm-srv-img img { transform: scale(1.07); }
  .hm-srv-rating {
    position: absolute; top: 10px; right: 10px;
    background: rgba(10,10,15,.82); backdrop-filter: blur(8px);
    padding: .18rem .55rem; border-radius: 100px;
    font-size: .72rem; font-weight: 600; color: var(--sg-text);
    display: flex; align-items: center; gap: .25rem;
  }
  .hm-srv-body { padding: 1.2rem 1.3rem; }
  .hm-srv-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.97rem; color:var(--sg-text); }
  .hm-srv-price { color:var(--sg-accent); font-weight:700; font-size:1.05rem; }
  .hm-srv-meta  { display:flex; align-items:center; gap:.35rem; font-size:.73rem; color:var(--sg-muted); margin-top:.5rem; }
  .hm-srv-book {
    width: 100%; margin-top: 1rem;
    background: rgba(255,107,53,.1);
    border: 1px solid rgba(255,107,53,.25);
    border-radius: 10px; padding: .62rem;
    color: var(--sg-accent); font-family:'DM Sans',sans-serif;
    font-weight: 600; font-size: .85rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    transition: background .2s, box-shadow .2s;
  }
  .hm-srv-book:hover { background: rgba(255,107,53,.18); box-shadow: 0 0 18px var(--sg-glow); }

  /* ── WHY CHOOSE ── */
  .hm-why {
    border-top: 1px solid var(--sg-border);
    border-bottom: 1px solid var(--sg-border);
    background: var(--sg-surface);
    padding: 3rem 5%;
  }
  .hm-why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.5rem; max-width:1280px; margin:0 auto; }
  .hm-why-item { display:flex; align-items:center; gap:1rem; }
  .hm-why-icon {
    width: 50px; height: 50px; border-radius: 14px; flex-shrink:0;
    display: flex; align-items: center; justify-content: center;
  }
  .hm-why-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.9rem; color:var(--sg-text); }
  .hm-why-sub   { font-size:.78rem; color:var(--sg-muted); margin-top:.15rem; }

  /* ── CTA BANNER ── */
  .hm-cta-wrap { padding: 3.5rem 5%; }
  .hm-cta {
    max-width: 1280px; margin: 0 auto;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 26px; padding: 3.5rem 5%;
    text-align: center; position: relative; overflow: hidden;
  }
  .hm-cta::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 75% at 50% 50%, rgba(255,107,53,.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .hm-cta-tag {
    display: inline-flex; align-items: center; gap: .5rem;
    color: var(--sg-accent2); font-size: .8rem; font-weight: 600;
    margin-bottom: .8rem;
  }
  .hm-cta h2 {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    letter-spacing: -1px; color: var(--sg-text); margin-bottom: .6rem;
  }
  .hm-cta p { color: var(--sg-muted); font-size: .95rem; max-width: 460px; margin: 0 auto 1.5rem; font-weight: 300; }
  .hm-cta-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    background: var(--sg-accent); color: #fff;
    padding: .82rem 1.9rem; border-radius: 100px;
    font-weight: 600; font-size: .97rem; text-decoration: none;
    box-shadow: 0 0 28px var(--sg-glow);
    transition: transform .2s, box-shadow .2s;
  }
  .hm-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 36px rgba(255,107,53,.45); }

  /* ── TRUST STRIP ── */
  .hm-trust {
    border-top: 1px solid var(--sg-border);
    padding: 2rem 5%;
    display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem;
  }
  .hm-trust-item { display:flex; align-items:center; gap:.55rem; color:var(--sg-muted); font-size:.83rem; font-weight:500; }
`;

function InjectHomeStyle() {
  useEffect(() => {
    if (!document.getElementById("hm-style")) {
      const el = document.createElement("style");
      el.id = "hm-style";
      el.textContent = HOME_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function Home() {
  const [services, setServices]   = useState<any[]>([]);
  const [bookings, setBookings]   = useState<any[]>([]);
  const [userName, setUserName]   = useState("");
  const [greeting, setGreeting]   = useState("Good morning");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let storedName = "Guest";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        storedName = user.name || "Guest";
        localStorage.setItem("name", storedName);
      } catch {
        storedName = localStorage.getItem("name") || "Guest";
      }
    } else {
      storedName = localStorage.getItem("name") || "Guest";
    }
    setUserName(storedName);

    const hour = new Date().getHours();
    if (hour < 12)      setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else                setGreeting("Good evening");

    axios.get("https://servixobackend.vercel.app/api/services?limit=6")
      .then((res) => setServices(res.data.slice(0, 6)))
      .catch(() => {});

    const token = localStorage.getItem("token");
    if (token) {
      axios.get("https://servixobackend.vercel.app/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setBookings(res.data.slice(0, 3))).catch(() => {});
    }
  }, []);

  const role = localStorage.getItem("role");
  if (role === "provider") return <Navigate to="/provider" replace />;
  if (role === "admin")    return <Navigate to="/admin"    replace />;

  const quickActions = [
    { icon: Search,   label: "Find Services", bg: "rgba(255,107,53,.12)",  color: "#ff6b35",  link: "/services"  },
    { icon: Calendar, label: "My Bookings",   bg: "rgba(0,212,255,.12)",   color: "#00d4ff",  link: "/user"      },
    { icon: HomeIcon, label: "Address",        bg: "rgba(255,190,11,.12)",  color: "#ffbe0b",  link: "/addresses" },
  ];

  const categories = [
    { icon: "🧹", name: "Cleaning",  c1: "#4ade80", c2: "#059669" },
    { icon: "🔧", name: "Plumbing",  c1: "#60a5fa", c2: "#0891b2" },
    { icon: "⚡", name: "Electrical",c1: "#fbbf24", c2: "#ea580c" },
    { icon: "❄️", name: "AC Repair", c1: "#22d3ee", c2: "#2563eb" },
    { icon: "🎨", name: "Painting",  c1: "#f472b6", c2: "#e11d48" },
    { icon: "🪴", name: "Gardening", c1: "#4ade80", c2: "#0d9488" },
    { icon: "🚗", name: "Vehicle",   c1: "#f87171", c2: "#db2777" },
    { icon: "🔨", name: "Carpentry", c1: "#fb923c", c2: "#d97706" },
  ];

  const fallbackServices = [
    { icon: "🧹", title: "Home Cleaning",      price: "499",  color: "#ff6b35", rating: 4.8 },
    { icon: "🔧", title: "Plumbing Service",   price: "299",  color: "#00d4ff", rating: 4.7 },
    { icon: "⚡", title: "Electrical Repair",  price: "349",  color: "#ffbe0b", rating: 4.9 },
    { icon: "❄️", title: "AC Service & Repair",price: "599",  color: "#60a5fa", rating: 4.8 },
    { icon: "🎨", title: "Home Painting",       price: "1999", color: "#f472b6", rating: 4.6 },
    { icon: "🪴", title: "Garden Maintenance",  price: "399",  color: "#4ade80", rating: 4.7 },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      completed: "hm-status hm-status-completed",
      confirmed: "hm-status hm-status-confirmed",
      pending:   "hm-status hm-status-pending",
      cancelled: "hm-status hm-status-cancelled",
    };
    return map[status] ?? "hm-status hm-status-default";
  };

  return (
    <>
      <InjectHomeStyle />
      <div className="hm-root">

        {/* ── HERO ── */}
        <section className="hm-hero">
          <div className="hm-hero-inner">
            <div>
              <div className="hm-greet">{greeting}</div>
              <h1 className="hm-hero-title">
                Welcome back,<br />
                <span>{userName.split(" ")[0]}!</span> 👋
              </h1>
              <p className="hm-hero-sub">
                Ready to book your next service? Explore our wide range of trusted professionals.
              </p>
              <div className="hm-stat-chips">
                <div className="hm-stat-chip">
                  <div className="hm-stat-chip-num">{bookings.length}<span>+</span></div>
                  <div className="hm-stat-chip-label">Active Bookings</div>
                </div>
                <div className="hm-stat-chip">
                  <div className="hm-stat-chip-num">{services.length || 6}<span>+</span></div>
                  <div className="hm-stat-chip-label">Services</div>
                </div>
                <div className="hm-stat-chip">
                  <div className="hm-stat-chip-num">4.9<span>★</span></div>
                  <div className="hm-stat-chip-label">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <div className="hm-qa-grid">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.link} className="hm-qa-card">
              <div className="hm-qa-icon" style={{ background: a.bg, border: `1px solid ${a.color}30` }}>
                <a.icon size={20} style={{ color: a.color }} />
              </div>
              <div className="hm-qa-label">{a.label}</div>
            </Link>
          ))}
        </div>

        {/* ── RECENT BOOKINGS ── */}
        {bookings.length > 0 && (
          <div className="hm-section" style={{ marginTop: "2rem" }}>
            <div className="hm-section-head">
              <div>
                <div className="hm-section-tag">Activity</div>
                <div className="hm-section-title">Recent Bookings</div>
                <div className="hm-section-sub">Track your service requests</div>
              </div>
              <Link to="/user" className="hm-view-all">
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div className="hm-bk-grid">
              {bookings.map((b) => (
                <div key={b._id} className="hm-bk-card">
                  <div className="hm-bk-top">
                    <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                      <div className="hm-bk-icon">
                        <Package size={18} style={{ color: "#ff6b35" }} />
                      </div>
                      <div>
                        <div className="hm-bk-name">{b.service?.title || "Service"}</div>
                        <div className="hm-bk-date">{new Date(b.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={statusClass(b.status)}>{b.status}</span>
                  </div>
                  <div className="hm-bk-addr">
                    <MapPin size={12} style={{ color: "#ff6b35", flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.address?.street || "Address not set"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BROWSE CATEGORIES ── */}
        <div className="hm-section">
          <div className="hm-section-head">
            <div>
              <div className="hm-section-tag">Explore</div>
              <div className="hm-section-title">Browse Categories</div>
              <div className="hm-section-sub">Find services by category</div>
            </div>
          </div>
          <div className="hm-cat-grid">
            {categories.map((cat) => (
              <Link key={cat.name} to="/services" className="hm-cat-card">
                <div
                  className="hm-cat-icon"
                  style={{ background: `linear-gradient(135deg,${cat.c1},${cat.c2})` }}
                >
                  {cat.icon}
                </div>
                <div className="hm-cat-label">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── RECOMMENDED SERVICES ── */}
        <div className="hm-section">
          <div className="hm-section-head">
            <div>
              <div className="hm-section-tag">Popular</div>
              <div className="hm-section-title">Recommended for You</div>
              <div className="hm-section-sub">Popular services you might like</div>
            </div>
            <Link to="/services" className="hm-view-all">
              View All <ChevronRight size={15} />
            </Link>
          </div>
          <div className="hm-srv-grid">
            {displayServices.map((svc: any, idx: number) => (
              <Link key={svc._id || idx} to="/services" className="hm-srv-card">
                <div
                  className="hm-srv-img"
                  style={{ background: svc.image ? "transparent" : `linear-gradient(135deg,${svc.color ?? "#1a1a26"},#0a0a0f)` }}
                >
                  {svc.image ? (
                    <img src={svc.image} alt={svc.title} />
                  ) : (
                    <span>{svc.icon}</span>
                  )}
                  <div className="hm-srv-rating">
                    <Star size={11} style={{ color: "#ffbe0b", fill: "#ffbe0b" }} />
                    {svc.averageRating?.toFixed(1) ?? svc.rating ?? "4.8"}
                  </div>
                </div>
                <div className="hm-srv-body">
                  <div className="hm-srv-title">{svc.title}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".5rem" }}>
                    <div className="hm-srv-price">₹{svc.price}</div>
                    <div className="hm-srv-meta">
                      <Clock size={12} /> Same day
                    </div>
                  </div>
                  <button className="hm-srv-book">
                    Book Now <ArrowRight size={14} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── WHY CHOOSE US ── */}
        <div className="hm-why">
          <div className="hm-why-grid">
            {[
              { icon: ShieldCheck,  label: "Verified Professionals", sub: "Background checked experts",   bg: "rgba(255,107,53,.1)",  color: "#ff6b35" },
              { icon: CalendarCheck,label: "Easy Scheduling",         sub: "Book in just a few clicks",    bg: "rgba(0,212,255,.1)",   color: "#00d4ff" },
              { icon: CreditCard,   label: "Secure Payments",         sub: "100% secure transactions",     bg: "rgba(255,190,11,.1)",  color: "#ffbe0b" },
            ].map((w) => (
              <div key={w.label} className="hm-why-item">
                <div className="hm-why-icon" style={{ background: w.bg, border: `1px solid ${w.color}25` }}>
                  <w.icon size={22} style={{ color: w.color }} />
                </div>
                <div>
                  <div className="hm-why-title">{w.label}</div>
                  <div className="hm-why-sub">{w.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="hm-cta-wrap">
          <div className="hm-cta">
            <div className="hm-cta-tag">
              <TrendingUp size={15} /> New Services Added Weekly
            </div>
            <h2>Need a Different Service?</h2>
            <p>Browse our complete catalog of 500+ verified services and find exactly what you need.</p>
            <Link to="/services" className="hm-cta-btn">
              Explore All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className="hm-trust">
          {[
            { icon: Award,       label: "Top Rated",      color: "#ff6b35" },
            { icon: ShieldCheck, label: "Verified",        color: "#4ade80" },
            { icon: Clock,       label: "24/7 Support",    color: "#00d4ff" },
            { icon: CreditCard,  label: "Secure Payment",  color: "#b478ff" },
          ].map((t) => (
            <div key={t.label} className="hm-trust-item">
              <t.icon size={18} style={{ color: t.color }} />
              {t.label}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Home;