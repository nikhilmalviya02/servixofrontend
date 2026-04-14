import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Search,
  UserCheck,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Clock,
  Award,
  ChevronRight,
  Play,
  Zap,
} from "lucide-react";
import homeCleaningImage from "../assets/home_cleaning_new.png";
import plumbingImage from "../assets/plumbing_new.png";
import electricalImage from "../assets/electrical_new.png";
import acRepairImage from "../assets/ac_repair_new.png";

/* ─────────────────────────────────────────────
   Inject light-theme CSS + Inter fonts
───────────────────────────────────────────── */
const GLOBAL_STYLE = `
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

  .sg-root {
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* mesh background */
  .sg-mesh::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 10% 80%, rgba(6,182,212,.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* hero */
  .sg-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem 5% 5rem;
    z-index: 1;
  }
  .sg-badge {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.2);
    border-radius: 100px;
    padding: .38rem 1rem;
    font-size: .72rem;
    font-weight: 500;
    color: var(--sg-accent);
    margin-bottom: 1.6rem;
    animation: sgFadeUp .7s ease both;
  }
  .sg-badge::before { content: '●'; font-size: .45rem; animation: sgPulse 1.5s ease infinite; }

  @keyframes sgPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes sgFadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .sg-h1 {
    font-family: 'Inter', sans-serif;
    font-size: clamp(2.6rem, 7vw, 5.5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -2px;
    color: var(--sg-text);
    animation: sgFadeUp .7s .1s ease both;
  }
  .sg-h1 em {
    font-style: normal;
    color: var(--sg-text);
  }
  .sg-hero-sub {
    max-width: 520px;
    margin: 1.4rem auto 2.2rem;
    color: var(--sg-muted);
    font-size: .95rem;
    line-height: 1.7;
    font-weight: 300;
    animation: sgFadeUp .7s .2s ease both;
  }
  .sg-hero-btns {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    animation: sgFadeUp .7s .3s ease both;
  }
  .sg-btn-primary {
    display: inline-flex; align-items: center; gap: .5rem;
    background: var(--sg-accent);
    color: #fff;
    padding: .82rem 1.9rem;
    border-radius: 100px;
    font-weight: 600;
    font-size: .97rem;
    text-decoration: none;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 30px var(--sg-glow);
  }
  .sg-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 40px rgba(59,130,246,.35); }

  .sg-btn-ghost {
    display: inline-flex; align-items: center; gap: .5rem;
    background: transparent;
    color: var(--sg-text);
    padding: .82rem 1.9rem;
    border-radius: 100px;
    font-weight: 500;
    font-size: .97rem;
    text-decoration: none;
    border: 1px solid var(--sg-border);
    transition: border-color .2s, background .2s;
  }
  .sg-btn-ghost:hover { border-color: rgba(0,0,0,.15); background: rgba(0,0,0,.02); }

  /* search bar */
  .sg-search {
    margin-top: 2.8rem;
    display: flex; align-items: center;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 16px;
    padding: .45rem .45rem .45rem 1.3rem;
    max-width: 540px;
    width: 100%;
    gap: .8rem;
    animation: sgFadeUp .7s .4s ease both;
    transition: border-color .2s;
  }
  .sg-search:focus-within { border-color: rgba(59,130,246,.4); }
  .sg-search input {
    flex:1; background: none; border: none; outline: none;
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    font-size: .88rem;
  }
  .sg-search input::placeholder { color: var(--sg-muted); }
  .sg-search button {
    background: var(--sg-accent); color: #fff; border: none;
    border-radius: 10px; padding: .65rem 1.3rem;
    font-family: 'Inter', sans-serif; font-weight: 500; cursor: pointer;
    white-space: nowrap; transition: background .2s;
    font-size: .85rem;
  }
  .sg-search button:hover { background: #2563eb; }

  /* stats */
  .sg-stats {
    display: flex; gap: 2.8rem; justify-content: center; flex-wrap: wrap;
    margin-top: 3.5rem;
    animation: sgFadeUp .7s .5s ease both;
  }
  .sg-stat-num {
    font-family: 'Inter', sans-serif;
    font-size: 2rem; font-weight: 800; color: var(--sg-text);
  }
  .sg-stat-num span { color: var(--sg-accent); }
  .sg-stat-label {
    font-size: .75rem; color: var(--sg-muted);
    margin-top: .2rem; letter-spacing: .5px; text-transform: uppercase;
  }

  /* section common */
  .sg-section { position: relative; z-index: 1; padding: 5.5rem 5%; }
  .sg-section-tag {
    display: inline-block;
    font-size: .72rem; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--sg-accent); margin-bottom: .7rem;
  }
  .sg-section-title {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1.7rem, 4vw, 2.8rem);
    font-weight: 800; letter-spacing: -1px;
    color: var(--sg-text); margin-bottom: .5rem;
  }
  .sg-section-sub {
    color: var(--sg-muted); font-size: .97rem; font-weight: 300;
    line-height: 1.65; margin-bottom: 2.8rem;
  }

  /* feature cards */
  .sg-feat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.2rem;
  }
  .sg-feat-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 2rem 1.8rem;
    transition: transform .25s, border-color .25s, box-shadow .25s;
  }
  .sg-feat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(59,130,246,.2);
    box-shadow: 0 12px 40px rgba(0,0,0,.08);
  }
  .sg-feat-icon {
    width: 50px; height: 50px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-bottom: 1.2rem;
  }
  .sg-feat-card h3 {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem;
    color: var(--sg-text); margin-bottom: .4rem;
  }
  .sg-feat-card p { color: var(--sg-muted); font-size: .85rem; line-height: 1.6; }

  /* category cards */
  .sg-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  .sg-cat-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 20px;
    padding: 1.6rem 1.4rem;
    text-decoration: none;
    transition: transform .25s, border-color .25s;
    display: block;
  }
  .sg-cat-card:hover { transform: translateY(-4px); border-color: rgba(59,130,246,.2); }
  .sg-cat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,.08);
  }
  .sg-cat-card h3 { font-family:'Inter',sans-serif; font-weight:700; font-size:.95rem; color:var(--sg-text); }
  .sg-cat-card p  { font-size:.75rem; color:var(--sg-muted); margin-top:.25rem; }
  .sg-cat-arrow   { font-size:1rem; color:var(--sg-accent); margin-top:.9rem; display:block; transition:transform .2s; }
  .sg-cat-card:hover .sg-cat-arrow { transform: translateX(4px); }

  /* steps */
  .sg-steps-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .sg-steps      { display: flex; flex-direction: column; gap: 1.2rem; }
  .sg-step {
    display: flex; gap: 1.1rem; align-items: flex-start;
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 16px; padding: 1.3rem 1.5rem;
    transition: border-color .2s;
  }
  .sg-step:hover { border-color: rgba(59,130,246,.15); }
  .sg-step-num {
    font-family:'Inter',sans-serif; font-weight:800; font-size:1.4rem;
    color:var(--sg-accent); min-width:32px; line-height:1;
  }
  .sg-step h4 { font-family:'Inter',sans-serif; font-weight:700; font-size:.95rem; color:var(--sg-text); margin-bottom:.3rem; }
  .sg-step p  { color:var(--sg-muted); font-size:.83rem; line-height:1.6; }

  /* phone mockup */
  .sg-phone {
    width: 250px;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 38px;
    padding: 1.6rem 1.3rem;
    box-shadow: 0 30px 80px rgba(0,0,0,.08), 0 0 60px rgba(59,130,246,.08);
    margin: auto;
  }
  .sg-phone-notch {
    width: 80px; height: 11px;
    background: var(--sg-bg); border-radius:100px;
    margin: 0 auto 1.4rem;
  }
  .sg-phone-row {
    display: flex; align-items:center; gap:.65rem;
    background: var(--sg-surface); border-radius:12px;
    padding: .72rem .85rem; margin-bottom: .6rem;
  }
  .sg-phone-title { font-size:.74rem; font-weight:600; color:var(--sg-text); }
  .sg-phone-sub   { font-size:.63rem; color:var(--sg-muted); }
  .sg-phone-badge {
    font-size:.58rem; padding:.13rem .45rem; border-radius:100px;
    font-weight:600; white-space:nowrap;
    background:rgba(59,130,246,.1); color:var(--sg-accent);
  }
  .sg-phone-badge.cyan { background:rgba(6,182,212,.08); color:var(--sg-cyan); }
  .sg-phone-map {
    background: linear-gradient(135deg,#f8fafc,#f1f5f9);
    border-radius:14px; height:90px; margin-top:.3rem;
    display:flex; align-items:center; justify-content:center;
    font-size:1.8rem; position:relative; overflow:hidden;
  }
  .sg-phone-map::before {
    content:''; position:absolute;
    width:70px; height:70px;
    border:1px dashed rgba(6,182,212,.25); border-radius:50%;
    animation: sgRipple 2s linear infinite;
  }
  .sg-phone-map::after {
    content:''; position:absolute;
    width:110px; height:110px;
    border:1px dashed rgba(6,182,212,.12); border-radius:50%;
    animation: sgRipple 2s .6s linear infinite;
  }
  @keyframes sgRipple {
    from{opacity:1;transform:scale(.5)}
    to  {opacity:0;transform:scale(1.8)}
  }
  .sg-phone-track {
    margin-top:.85rem; background:var(--sg-accent);
    border-radius:12px; padding:.65rem;
    text-align:center; font-weight:600; font-size:.82rem;
    cursor:pointer; color:#fff;
  }

  /* service cards */
  .sg-srv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.2rem;
  }
  .sg-srv-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px; overflow: hidden;
    text-decoration: none;
    transition: transform .3s, border-color .3s, box-shadow .3s;
    display: block;
  }
  .sg-srv-card:hover {
    transform: translateY(-5px);
    border-color: rgba(59,130,246,.25);
    box-shadow: 0 12px 40px rgba(0,0,0,.4);
  }
  .sg-srv-img {
    height: 160px; display:flex; align-items:center; justify-content:center;
    font-size: 4.5rem; position: relative;
  }
  .sg-srv-rating {
    position:absolute; top:10px; right:10px;
    background:rgba(255,255,255,.9); backdrop-filter:blur(8px);
    padding:.3rem .7rem; border-radius:100px;
    font-size:.75rem; font-weight:700; color:var(--sg-text);
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    display:flex; align-items:center; gap:.25rem;
  }
  .sg-srv-body { padding: 1.3rem 1.5rem; }
  .sg-srv-body h3 { font-family:'Inter',sans-serif; font-weight:700; font-size:.97rem; color:var(--sg-text); }
  .sg-srv-price { color:var(--sg-accent); font-weight:700; font-size:1rem; margin-top:.3rem; }
  .sg-srv-meta  { display:flex; align-items:center; gap:.4rem; margin-top:.7rem; font-size:.75rem; color:var(--sg-muted); }

  /* testimonials */
  .sg-tgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.2rem; }
  .sg-tcard {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:20px; padding:1.7rem;
    transition: transform .2s;
  }
  .sg-tcard:hover { transform: translateY(-3px); }
  .sg-stars { color:var(--sg-accent2); font-size:.88rem; margin-bottom:1rem; letter-spacing:2px; }
  .sg-tcard p { color:var(--sg-muted); font-size:.88rem; line-height:1.7; margin-bottom:1.1rem; font-style:italic; }
  .sg-avatar {
    width:38px; height:38px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:.9rem; font-weight:700; font-family:'Inter',sans-serif;
  }
  .sg-aname { font-weight:600; font-size:.86rem; color:var(--sg-text); }
  .sg-aloc  { font-size:.73rem; color:var(--sg-muted); }

  /* cta banner */
  .sg-cta {
    margin: 0 5% 5.5rem;
    background: var(--sg-surface);
    border:1px solid var(--sg-border);
    border-radius:28px; padding:4rem 5%;
    text-align:center; position:relative; overflow:hidden; z-index:1;
  }
  .sg-cta::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 50% 80% at 50% 50%,rgba(59,130,246,.08) 0%,transparent 70%);
    pointer-events:none;
  }
  .sg-cta h2 {
    font-family:'Inter',sans-serif;
    font-size:clamp(1.7rem,4vw,2.8rem); font-weight:800;
    letter-spacing:-1px; color:var(--sg-text); margin-bottom:.9rem;
  }
  .sg-cta p { color:var(--sg-muted); font-size:.97rem; margin-bottom:1.8rem; font-weight:300; }
  .sg-app-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  .sg-app-btn {
    display:flex; align-items:center; gap:.65rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:14px; padding:.8rem 1.5rem;
    text-decoration:none; color:var(--sg-text);
    transition: border-color .2s, background .2s;
  }
  .sg-app-btn:hover { border-color:rgba(59,130,246,.25); background:rgba(59,130,246,.05); }
  .sg-app-label { font-size:.6rem; color:var(--sg-muted); }
  .sg-app-name  { font-family:'Inter',sans-serif; font-weight:700; font-size:.87rem; color:var(--sg-text); }

  /* trust strip */
  .sg-trust {
    border-top:1px solid var(--sg-border); padding:2rem 5%;
    display:flex; gap:2.5rem; justify-content:center; flex-wrap:wrap;
    position:relative; z-index:1;
  }
  .sg-trust-item { display:flex; align-items:center; gap:.6rem; color:var(--sg-muted); font-size:.85rem; font-weight:500; }

  /* footer */
  .sg-footer {
    border-top:1px solid var(--sg-border); padding:2.8rem 5%;
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:1.3rem; position:relative; z-index:1;
  }
  .sg-footer-logo { font-family:'Inter',sans-serif; font-weight:800; font-size:1.2rem; color:var(--sg-text); text-decoration:none; }
  .sg-footer-logo span { color:var(--sg-accent); }
  .sg-footer p { color:var(--sg-muted); font-size:.78rem; }
  .sg-footer-links { display:flex; gap:1.8rem; }
  .sg-footer-links a { color:var(--sg-muted); text-decoration:none; font-size:.78rem; transition:color .2s; }
  .sg-footer-links a:hover { color:var(--sg-text); }

  /* divider line */
  .sg-divider { border:none; border-top:1px solid var(--sg-border); margin:0; }

  @media(max-width:768px){
    .sg-hero { padding: 5rem 4% 4rem; }
    .sg-h1 { font-size: clamp(2.2rem, 8vw, 3.5rem); }
    .sg-hero-sub { font-size: .9rem; margin: 1.2rem auto 2rem; }
    .sg-hero-btns { flex-direction: column; align-items: center; gap: 1rem; }
    .sg-btn-primary, .sg-btn-ghost { width: 100%; max-width: 280px; justify-content: center; }
    
    .sg-search { 
      flex-direction: column; 
      padding: 1rem; 
      gap: 1rem;
      border-radius: 16px;
    }
    .sg-search input { 
      padding: .8rem; 
      border: 1px solid var(--sg-border);
      border-radius: 12px;
      font-size: .9rem;
    }
    .sg-search button { 
      width: 100%; 
      padding: .8rem;
      font-size: .9rem;
    }
    
    .sg-stats { gap: 2rem; margin-top: 3rem; }
    .sg-stat-num { font-size: 1.6rem; }
    
    .sg-feat-grid { grid-template-columns: 1fr; gap: 1rem; }
    .sg-feat-card { padding: 1.5rem; }
    
    .sg-cat-grid { grid-template-columns: repeat(2, 1fr); gap: .8rem; }
    .sg-cat-card { padding: 1.2rem 1rem; }
    .sg-cat-icon { width: 44px; height: 44px; font-size: 1.2rem; }
    
    .sg-steps-wrap { grid-template-columns:1fr; gap: 2rem; }
    .sg-phone { display:none; }
    .sg-nav-links { display:none; }
    
    .sg-srv-grid { grid-template-columns: 1fr; }
    .sg-srv-img { height: 140px; font-size: 3.5rem; }
    
    .sg-tgrid { grid-template-columns: 1fr; }
    .sg-tcard { padding: 1.5rem; }
    
    .sg-cta { 
      margin: 0 4% 4rem; 
      padding: 3rem 4%; 
      border-radius: 20px;
    }
    .sg-cta h2 { font-size: clamp(1.5rem, 6vw, 2rem); }
    .sg-app-btns { flex-direction: column; align-items: center; }
    .sg-app-btn { width: 100%; max-width: 280px; justify-content: center; }
    
    .sg-footer { 
      flex-direction: column; 
      text-align: center; 
      gap: 1.5rem;
      padding: 2rem 4%;
    }
    .sg-footer-links { justify-content: center; }
    
    .sg-section { padding: 4rem 4%; }
    .sg-section-title { font-size: clamp(1.5rem, 6vw, 2rem); }
    .sg-section-sub { font-size: .9rem; }
  }
  
  @media(max-width:480px){
    .sg-cat-grid { grid-template-columns: 1fr; }
    .sg-stats { gap: 1.5rem; }
    .sg-stat-num { font-size: 1.4rem; }
    .sg-stat-label { font-size: .65rem; }
  }
`;

/* ─── inject style once ─── */
function InjectStyle() {
  useEffect(() => {
    if (!document.getElementById("sg-style")) {
      const el = document.createElement("style");
      el.id = "sg-style";
      el.textContent = GLOBAL_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
function LandingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    axios
      .get("https://servixobackend.vercel.app/api/services?limit=4")
      .then((res) => setServices(res.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── data ── */
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Professionals",
      desc: "All service providers are background checked and verified to ensure trust and quality.",
      bg: "rgba(59,130,246,.12)", color: "#3b82f6",
    },
    {
      icon: CalendarCheck,
      title: "Easy Booking",
      desc: "Book services in just a few clicks with a smooth and modern experience.",
      bg: "rgba(6,182,212,.1)", color: "#06b6d4",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      desc: "Safe and encrypted payment options for complete peace of mind.",
      bg: "rgba(251,191,36,.1)", color: "#fbbf24",
    },
  ];

  const categories = [
    { icon: "🧹", name: "Cleaning",      count: "50+ services", c1: "#4ade80", c2: "#059669" },
    { icon: "🔧", name: "Plumbing",      count: "30+ services", c1: "#60a5fa", c2: "#0891b2" },
    { icon: "⚡", name: "Electrical",    count: "25+ services", c1: "#fbbf24", c2: "#ea580c" },
    { icon: "❄️", name: "AC & Appliances",count:"40+ services", c1: "#22d3ee", c2: "#2563eb" },
    { icon: "🎨", name: "Painting",      count: "20+ services", c1: "#f472b6", c2: "#e11d48" },
    { icon: "🪴", name: "Gardening",     count: "15+ services", c1: "#4ade80", c2: "#0d9488" },
    { icon: "🚗", name: "Vehicle Care",  count: "35+ services", c1: "#f87171", c2: "#db2777" },
    { icon: "🔨", name: "Carpentry",     count: "18+ services", c1: "#fb923c", c2: "#d97706" },
  ];

  const steps = [
    { icon: Search,      title: "Search",           desc: "Find the service you need from our wide range" },
    { icon: UserCheck,   title: "Choose Provider",  desc: "Select from verified professionals near you" },
    { icon: Calendar,    title: "Book & Pay",        desc: "Schedule and pay securely in seconds" },
    { icon: CheckCircle, title: "Get It Done",       desc: "Relax while we handle the rest" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma", role: "Homeowner", avatar: "P",
      avatarBg: "rgba(59,130,246,.15)", avatarColor: "#3b82f6",
      rating: 5,
      content: "The cleaning service was exceptional! Arrived on time, did a thorough job. Highly recommend!",
    },
    {
      name: "Rahul Patel", role: "Business Owner", avatar: "R",
      avatarBg: "rgba(6,182,212,.12)", avatarColor: "#06b6d4",
      rating: 5,
      content: "Found a great electrician through ServexaGo. Booking was seamless and the work was top-notch.",
    },
    {
      name: "Anita Desai", role: "Working Professional", avatar: "A",
      avatarBg: "rgba(180,120,255,.15)", avatarColor: "#b478ff",
      rating: 5,
      content: "Booked AC repair Sunday evening, fixed by Monday morning. Incredible service!",
    },
  ];

  const fallbackServices = [
    { icon: "🧹", title: "Home Cleaning",  price: "₹499", color: "#3b82f6", image: homeCleaningImage },
    { icon: "🔧", title: "Plumbing",        price: "₹299", color: "#06b6d4", image: plumbingImage },
    { icon: "⚡", title: "Electrical",      price: "₹349", color: "#fbbf24", image: electricalImage },
    { icon: "❄️", title: "AC Repair",       price: "₹599", color: "#60a5fa", image: acRepairImage },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  return (
    <>
      <InjectStyle />
      <div className="sg-root sg-mesh">
        {/* ── HERO ── */}
        <section className="sg-hero" ref={heroRef}>
          <div className="sg-badge">
            <Zap size={10} /> Now available in 40+ cities across India
          </div>

          <h1 className="sg-h1">
            Your City.<br /><em>Your Services.</em><br />One Tap.
          </h1>

          <p className="sg-hero-sub">
            ServexaGo connects you with verified professionals for home repairs,
            cleaning, beauty, and more — fast, reliable, right at your doorstep.
          </p>

          <div className="sg-hero-btns">
            <Link to="/register" className="sg-btn-primary">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="sg-btn-ghost">
              <Play size={15} style={{ color: "#3b82f6" }} /> Explore Services
            </Link>
          </div>

          {/* search */}
          <div className="sg-search">
            <Search size={16} style={{ color: "var(--sg-muted)", flexShrink: 0 }} />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search plumber, electrician, cleaner…"
            />
            <button>Find Now</button>
          </div>

          {/* stats */}
          <div className="sg-stats">
            {[
              { num: "500", sup: "+", label: "Verified Providers" },
              { num: "10K", sup: "+", label: "Happy Customers" },
              { num: "40",  sup: "+", label: "Cities" },
              { num: "4.9", sup: "★", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div className="sg-stat-num">{s.num}<span>{s.sup}</span></div>
                <div className="sg-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section
          id="features"
          data-animate
          className="sg-section"
          style={{ background: "var(--sg-surface)", borderTop: "1px solid var(--sg-border)", borderBottom: "1px solid var(--sg-border)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
            <span className="sg-section-tag">Why Choose Us</span>
            <h2 className="sg-section-title">The Better Way to Get Things Done</h2>
            <p className="sg-section-sub" style={{ margin: ".5rem auto 0", textAlign: "center" }}>
              Hassle-free service booking with our trusted platform
            </p>
          </div>
          <div className="sg-feat-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="sg-feat-card"
                style={{
                  opacity: isVisible["features"] ? 1 : 0,
                  transform: isVisible["features"] ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity .6s ${i * 100}ms, transform .6s ${i * 100}ms`,
                }}
              >
                <div className="sg-feat-icon" style={{ background: f.bg }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section id="services" data-animate className="sg-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "2.8rem" }}>
            <div>
              <span className="sg-section-tag">What We Offer</span>
              <h2 className="sg-section-title" style={{ marginBottom: 0 }}>Services at Your Fingertips</h2>
              <p className="sg-section-sub" style={{ marginBottom: 0, marginTop: ".4rem" }}>
                From a leaking tap to a full home makeover
              </p>
            </div>
            <Link to="/login" style={{ display: "flex", alignItems: "center", gap: ".35rem", color: "var(--sg-accent)", textDecoration: "none", fontSize: ".88rem", fontWeight: 600, marginTop: "1rem" }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="sg-cat-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to="/login"
                className="sg-cat-card"
                style={{
                  opacity: isVisible["services"] ? 1 : 0,
                  transform: isVisible["services"] ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity .5s ${i * 50}ms, transform .5s ${i * 50}ms`,
                }}
              >
                <div
                  className="sg-cat-icon"
                  style={{ background: `linear-gradient(135deg,${cat.c1},${cat.c2})` }}
                >
                  {cat.icon}
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
                <span className="sg-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="how-it-works"
          data-animate
          className="sg-section"
          style={{ background: "var(--sg-surface)", borderTop: "1px solid var(--sg-border)", borderBottom: "1px solid var(--sg-border)" }}
        >
          <div className="sg-steps-wrap">
            <div>
              <span className="sg-section-tag">Process</span>
              <h2 className="sg-section-title">Book in<br />60 Seconds</h2>
              <p className="sg-section-sub">No calls, no waiting. Choose your service, confirm your slot, done.</p>
              <div className="sg-steps">
                {steps.map((s, i) => (
                  <div key={i} className="sg-step">
                    <div className="sg-step-num">0{i + 1}</div>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* phone mockup */}
            <div>
              <div className="sg-phone">
                <div className="sg-phone-notch" />
                <div className="sg-phone-row">
                  <span style={{ fontSize: "1.1rem" }}>🧹</span>
                  <div style={{ flex: 1 }}>
                    <div className="sg-phone-title">Home Cleaning</div>
                    <div className="sg-phone-sub">2BHK Deep Clean</div>
                  </div>
                  <span className="sg-phone-badge">TODAY</span>
                </div>
                <div className="sg-phone-row">
                  <span style={{ fontSize: "1.1rem" }}>⚡</span>
                  <div style={{ flex: 1 }}>
                    <div className="sg-phone-title">Electrician</div>
                    <div className="sg-phone-sub">Fan Installation</div>
                  </div>
                  <span className="sg-phone-badge cyan">11:00 AM</span>
                </div>
                <div className="sg-phone-map">📍</div>
                <div className="sg-phone-track">Track Your Expert →</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRENDING SERVICES ── */}
        <section id="popular" data-animate className="sg-section">
          <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
            <span className="sg-section-tag">Popular</span>
            <h2 className="sg-section-title">Trending Services</h2>
            <p className="sg-section-sub" style={{ margin: ".5rem auto 0", textAlign: "center" }}>
              Most booked services by our customers this week
            </p>
          </div>
          <div className="sg-srv-grid">
            {displayServices.map((svc: any, i: number) => (
              <Link
                key={svc._id || i}
                to="/login"
                className="sg-srv-card"
                style={{
                  opacity: isVisible["popular"] ? 1 : 0,
                  transform: isVisible["popular"] ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity .6s ${i * 100}ms, transform .6s ${i * 100}ms`,
                }}
              >
                <div
                  className="sg-srv-img"
                  style={{ background: svc.image ? "transparent" : `linear-gradient(135deg,${svc.color ?? "#1a1a26"},#0a0a0f)` }}
                >
                  {svc.image ? (
                    <img src={svc.image} alt={svc.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "4rem" }}>{svc.icon}</span>
                  )}
                  <div className="sg-srv-rating">
                    <Star size={12} style={{ color: "#ffbe0b", fill: "#ffbe0b" }} />
                    {svc.averageRating?.toFixed(1) ?? "4.8"}
                  </div>
                </div>
                <div className="sg-srv-body">
                  <h3>{svc.title}</h3>
                  <p className="sg-srv-price">From {svc.price ? `₹${svc.price}` : svc.price}</p>
                  <div className="sg-srv-meta">
                    <Clock size={13} /> Same day service
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section
          id="testimonials"
          data-animate
          className="sg-section"
          style={{ background: "var(--sg-surface)", borderTop: "1px solid var(--sg-border)", borderBottom: "1px solid var(--sg-border)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
            <span className="sg-section-tag">Reviews</span>
            <h2 className="sg-section-title">Loved Across India</h2>
            <p className="sg-section-sub" style={{ margin: ".5rem auto 0", textAlign: "center" }}>
              Real people, real experiences
            </p>
          </div>
          <div className="sg-tgrid">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="sg-tcard"
                style={{
                  opacity: isVisible["testimonials"] ? 1 : 0,
                  transform: isVisible["testimonials"] ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity .6s ${i * 100}ms, transform .6s ${i * 100}ms`,
                }}
              >
                <div className="sg-stars">{"★".repeat(t.rating)}</div>
                <p>"{t.content}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                  <div className="sg-avatar" style={{ background: t.avatarBg, color: t.avatarColor }}>{t.avatar}</div>
                  <div>
                    <div className="sg-aname">{t.name}</div>
                    <div className="sg-aloc">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <div className="sg-cta">
          <h2>Ready to Get Started?</h2>
          <p>Download the ServexaGo app and book your first service in under a minute.</p>
          <div className="sg-app-btns">
            <a 
              href="https://play.google.com/store" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '.65rem',
                backgroundColor: '#1a1a26', 
                border: '1px solid var(--sg-border)',
                borderRadius: '14px', 
                padding: '.8rem 1.5rem',
                textDecoration: 'none', 
                color: 'var(--sg-text)',
                transition: 'border-color .2s, background .2s'
              }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/270px-Google_Play_Store_badge_EN.svg.png" 
                alt="Get it on Google Play"
                style={{ 
                  width: '135px',
                  height: '40px'
                }}
              />
            </a>
            <Link to="/register" className="sg-btn-primary">
              Book Online <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className="sg-trust">
          {[
            { icon: Award,      label: "Top Rated",      color: "#ff6b35" },
            { icon: ShieldCheck,label: "Verified Pros",   color: "#4ade80" },
            { icon: Phone,      label: "24/7 Support",    color: "#00d4ff" },
            { icon: CreditCard, label: "Secure Payment",  color: "#b478ff" },
          ].map((b) => (
            <div key={b.label} className="sg-trust-item">
              <b.icon size={20} style={{ color: b.color }} />
              {b.label}
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <footer className="sg-footer">
          <Link to="/" className="sg-footer-logo">Servexa<span>Go</span></Link>
          <p> 2026 ServexaGo. All rights reserved.</p>
          <div className="sg-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/support">Support</Link>
            <Link to="/careers">Careers</Link>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
