import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Search, Star, Clock, MapPin, Calendar,
  X, ChevronDown, Shield, SlidersHorizontal, Zap,
} from "lucide-react";

/* ─── Light theme styles ─── */
const SV_STYLE = `
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

  .sv-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding-top: 4.5rem;
  }

  /* mesh */
  .sv-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 10%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 10% 80%, rgba(6,182,212,.05) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .sv-inner { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:0 5%; }

  /* ── HERO ── */
  .sv-hero { text-align:center; padding:3rem 5% 2rem; }
  .sv-hero-tag {
    display:inline-flex; align-items:center; gap:.45rem;
    background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25);
    border-radius:100px; padding:.32rem .9rem;
    font-size:.75rem; font-weight:600; color:var(--sg-accent);
    margin-bottom:1rem;
  }
  .sv-hero-tag::before { content:'●'; font-size:.4rem; animation:sv-pulse 1.5s ease infinite; }
  @keyframes sv-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .sv-hero-title {
    font-family:'Inter',sans-serif;
    font-size:clamp(2rem,5vw,3.5rem); font-weight:800;
    letter-spacing:-2px; line-height:1.05; color:var(--sg-text);
  }
  .sv-hero-title em { font-style:normal; color:var(--sg-text); }
  .sv-hero-sub { color:var(--sg-muted); font-size:1rem; font-weight:300; max-width:500px; margin:.9rem auto 0; line-height:1.7; }

  /* ── SEARCH BAR ── */
  .sv-search-wrap {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:20px; padding:1.2rem 1.4rem; margin:1.8rem auto 0;
    max-width:1280px;
  }
  .sv-search-row { display:flex; gap:.8rem; }

  .sv-search-box {
    flex:1; display:flex; align-items:center; gap:.7rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:12px; padding:.68rem 1rem;
    transition: border-color .2s;
  }
  .sv-search-box:focus-within { border-color:rgba(59,130,246,.45); }
  .sv-search-box input {
    flex:1; background:none; border:none; outline:none;
    color:var(--sg-text); font-family:'Inter',sans-serif; font-size:.92rem;
  }
  .sv-search-box input::placeholder { color:var(--sg-muted); }

  .sv-filter-btn {
    display:flex; align-items:center; gap:.5rem;
    padding:.68rem 1.3rem; border-radius:12px;
    font-family:'Inter',sans-serif; font-size:.88rem; font-weight:500;
    border:1px solid var(--sg-border); cursor:pointer;
    background:var(--sg-surface2); color:var(--sg-muted);
    transition:background .2s, border-color .2s, color .2s;
  }
  .sv-filter-btn:hover, .sv-filter-btn.active {
    background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.3); color:var(--sg-accent);
  }

  /* expanded filters */
  .sv-filters {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:.8rem; padding-top:1rem; margin-top:1rem;
    border-top:1px solid var(--sg-border);
  }
  .sv-select, .sv-filter-input {
    width:100%; 
    background:var(--sg-surface2); 
    border:2px solid var(--sg-border);
    border-radius:16px; 
    padding:.85rem 1rem; 
    color:var(--sg-text);
    font-family:'Inter',sans-serif; 
    font-size:.9rem;
    font-weight:500;
    outline:none; 
    appearance:none; 
    transition:all .3s ease;
    cursor:pointer;
  }
  .sv-select:hover, .sv-filter-input:hover {
    border-color:rgba(59,130,246,.3);
    background:rgba(59,130,246,.02);
  }
  .sv-select:focus, .sv-filter-input:focus { 
    border-color:var(--sg-accent);
    box-shadow:0 0 0 4px rgba(59,130,246,.1);
    background:var(--sg-bg);
  }
  .sv-select option { 
    background:var(--sg-bg); 
    color:var(--sg-text);
    padding:.75rem;
    font-weight:500;
  }
  .sv-filter-input::placeholder { color:var(--sg-muted); }

  /* results count */
  .sv-count { color:var(--sg-muted); font-size:.85rem; margin-bottom:1.5rem; }
  .sv-count strong { color:var(--sg-text); }

  /* ── SERVICE CARDS ── */
  .sv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.2rem; }

  .sv-card {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:22px; overflow:hidden;
    transition: transform .3s, border-color .3s, box-shadow .3s;
  }
  .sv-card:hover { transform:translateY(-5px); border-color:rgba(59,130,246,.22); box-shadow:0 12px 40px rgba(59,130,246,.15); }

  /* image area */
  .sv-card-img { position:relative; height:200px; overflow:hidden; }
  .sv-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
  .sv-card:hover .sv-card-img img { transform:scale(1.06); }

  .sv-price-badge {
    position:absolute; top:12px; right:12px;
    background:rgba(10,10,15,.85); backdrop-filter:blur(10px);
    border:1px solid rgba(59,130,246,.3);
    padding:.28rem .75rem; border-radius:100px;
    font-family:'Inter',sans-serif; font-weight:800; font-size:.97rem;
    color:var(--sg-accent);
  }
  .sv-cat-badge {
    position:absolute; bottom:12px; left:12px;
    background:rgba(10,10,15,.75); backdrop-filter:blur(8px);
    border:1px solid var(--sg-border);
    padding:.22rem .7rem; border-radius:100px;
    font-size:.72rem; font-weight:600; color:var(--sg-text);
  }

  /* card body */
  .sv-card-body { padding:1.3rem 1.4rem; }
  .sv-card-title {
    font-family:'Inter',sans-serif; font-weight:700; font-size:1rem;
    color:var(--sg-text); margin-bottom:.6rem;
  }

  /* rating row */
  .sv-rating-row { display:flex; align-items:center; gap:.7rem; margin-bottom:.7rem; }
  .sv-rating-chip {
    display:flex; align-items:center; gap:.3rem;
    background:rgba(255,190,11,.1); border:1px solid rgba(255,190,11,.2);
    padding:.22rem .65rem; border-radius:100px;
    font-size:.78rem; font-weight:700; color:var(--sg-accent2);
  }
  .sv-review-btn {
    font-size:.75rem; color:var(--sg-muted); text-decoration:none;
    background:none; border:none; cursor:pointer; padding:0;
    transition:color .2s;
  }
  .sv-review-btn:hover { color:var(--sg-accent); }

  .sv-desc { color:var(--sg-muted); font-size:.82rem; line-height:1.6; margin-bottom:.9rem;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

  /* provider row */
  .sv-provider {
    display:flex; align-items:center; gap:.7rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:12px; padding:.7rem .9rem; margin-bottom:1rem;
  }
  .sv-provider-avatar {
    width:36px; height:36px; border-radius:50%;
    background:rgba(59,130,246,.15); border:1.5px solid rgba(59,130,246,.3);
    display:flex; align-items:center; justify-content:center;
    font-family:'Inter',sans-serif; font-weight:800; font-size:.85rem;
    color:var(--sg-accent); flex-shrink:0;
  }
  .sv-provider-name {
    font-size:.83rem; font-weight:600; color:var(--sg-text);
    text-decoration:none; display:block; transition:color .2s;
  }
  .sv-provider-name:hover { color:var(--sg-accent); }
  .sv-verified { display:flex; align-items:center; gap:.3rem; font-size:.7rem; color:#4ade80; margin-top:.1rem; }

  /* action buttons */
  .sv-actions { display:flex; flex-direction:column; gap:.5rem; }
  .sv-btn-book {
    width:100%; padding:.72rem;
    background:var(--sg-accent); color:#fff; border:none; border-radius:10px;
    font-family:'Inter',sans-serif; font-weight:600; font-size:.88rem;
    cursor:pointer; box-shadow:0 0 18px var(--sg-glow);
    display:flex; align-items:center; justify-content:center; gap:.4rem;
    transition:transform .2s, box-shadow .2s, background .2s;
  }
  .sv-btn-book:hover { transform:translateY(-1px); box-shadow:0 4px 24px rgba(59,130,246,.35); background:#2563eb; }

  .sv-btn-review {
    width:100%; padding:.68rem;
    background:rgba(255,255,255,.04); border:1px solid var(--sg-border);
    border-radius:10px; color:var(--sg-muted);
    font-family:'Inter',sans-serif; font-weight:500; font-size:.85rem;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.4rem;
    transition:background .2s, color .2s, border-color .2s;
  }
  .sv-btn-review:hover { background:rgba(255,190,11,.08); border-color:rgba(255,190,11,.25); color:var(--sg-accent2); }

  .sv-role-badge {
    text-align:center; padding:.7rem;
    background:rgba(255,255,255,.03); border:1px solid var(--sg-border);
    border-radius:10px; font-size:.78rem; color:var(--sg-muted);
  }

  /* skeleton */
  .sv-skeleton { background:var(--sg-surface); border-radius:22px; overflow:hidden; border:1px solid var(--sg-border); }
  .sv-skel-img { height:200px; background:var(--sg-surface2); animation:sv-shimmer 1.5s ease infinite; }
  .sv-skel-body { padding:1.3rem; }
  .sv-skel-line {
    height:14px; background:var(--sg-surface2); border-radius:8px;
    margin-bottom:.7rem; animation:sv-shimmer 1.5s ease infinite;
  }
  @keyframes sv-shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }

  /* empty */
  .sv-empty { text-align:center; padding:5rem 2rem; }
  .sv-empty-icon {
    width:72px; height:72px; border-radius:50%;
    background:rgba(255,255,255,.04); border:1px solid var(--sg-border);
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 1.2rem;
  }
  .sv-empty h3 { font-family:'Inter',sans-serif; font-weight:700; font-size:1.1rem; color:var(--sg-text); }
  .sv-empty p  { color:var(--sg-muted); font-size:.85rem; margin-top:.35rem; }

  /* ── MODALS ── */
  .sv-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    padding:1rem; z-index:200;
  }

  .sv-modal {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:24px; width:100%; max-width:460px;
    overflow:hidden; max-height:90vh; display:flex; flex-direction:column;
  }
  .sv-modal-lg { max-width:520px; }

  .sv-modal-head {
    padding:1.4rem 1.6rem;
    border-bottom:1px solid var(--sg-border);
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(255,107,53,.06);
  }
  .sv-modal-title { font-family:'Syne',sans-serif; font-weight:800; font-size:1.05rem; color:var(--sg-text); }
  .sv-modal-sub   { font-size:.78rem; color:var(--sg-muted); margin-top:.1rem; }

  .sv-modal-close {
    width:32px; height:32px; border-radius:50%;
    background:rgba(255,255,255,.06); border:1px solid var(--sg-border);
    display:flex; align-items:center; justify-content:center;
    color:var(--sg-muted); cursor:pointer; transition:background .2s, color .2s;
  }
  .sv-modal-close:hover { background:rgba(255,107,107,.12); color:#ff6b6b; }

  .sv-modal-body { padding:1.4rem 1.6rem; overflow-y:auto; flex:1; }
  .sv-modal-foot { padding:1rem 1.6rem; border-top:1px solid var(--sg-border); }

  /* modal fields */
  .sv-m-field { margin-bottom:1rem; }
  .sv-m-label {
    display:flex; align-items:center; gap:.4rem;
    font-size:.72rem; font-weight:600; color:var(--sg-muted);
    letter-spacing:.5px; text-transform:uppercase; margin-bottom:.42rem;
  }
  .sv-m-input, .sv-m-select {
    width:100%; 
    background:var(--sg-surface2); 
    border:2px solid var(--sg-border);
    border-radius:16px; 
    padding:.85rem 1rem; 
    color:var(--sg-text);
    font-family:'Inter',sans-serif; 
    font-size:.9rem;
    font-weight:500;
    outline:none;
    transition:all .3s ease; 
    appearance:none;
    cursor:pointer;
  }
  .sv-m-input:hover, .sv-m-select:hover {
    border-color:rgba(59,130,246,.3);
    background:rgba(59,130,246,.02);
  }
  .sv-m-input:focus, .sv-m-select:focus {
    border-color:var(--sg-accent);
    box-shadow:0 0 0 4px rgba(59,130,246,.1);
    background:var(--sg-bg);
  }
  .sv-m-select option { 
    background:var(--sg-bg); 
    color:var(--sg-text);
    padding:.75rem;
    font-weight:500;
  }
  .sv-m-input::-webkit-calendar-picker-indicator { filter:invert(.6); cursor:pointer; }

  /* emergency toggle */
  .sv-emergency {
    display:flex; align-items:center; gap:.9rem;
transition:background .2s;
}
.sv-emergency:hover { background:rgba(255,107,107,.12); }
.sv-emergency input { width:16px; height:16px; accent-color:#ff6b6b; cursor:pointer; }
.sv-emergency-label { font-weight:600; font-size:.88rem; color:#ff6b6b; }
.sv-emergency-sub   { font-size:.75rem; color:rgba(255,107,107,.7); margin-top:.1rem; }
    background:rgba(255,107,107,.07); border:1px solid rgba(255,107,107,.2);
    border-radius:14px; padding:1rem 1.1rem; cursor:pointer;
    transition:background .2s;
  }
  .sv-emergency:hover { background:rgba(255,107,107,.12); }
  .sv-emergency input { width:16px; height:16px; accent-color:#ff6b6b; cursor:pointer; }
  .sv-emergency-label { font-weight:600; font-size:.88rem; color:#ff6b6b; }
  .sv-emergency-sub   { font-size:.75rem; color:rgba(255,107,107,.7); margin-top:.1rem; }

  /* modal buttons */
  .sv-modal-btns { display:flex; gap:.7rem; }
  .sv-m-btn-cancel {
    flex:1; padding:.78rem; border-radius:12px;
    background:rgba(255,255,255,.04); border:1px solid var(--sg-border);
    color:var(--sg-muted); font-family:'DM Sans',sans-serif;
    font-weight:500; cursor:pointer; transition:background .2s, color .2s;
  }
  .sv-m-btn-cancel:hover { background:rgba(255,255,255,.08); color:var(--sg-text); }

  .sv-m-btn-confirm {
    flex:1; padding:.78rem; border-radius:12px;
    background:var(--sg-accent); color:#fff; border:none;
    font-family:'DM Sans',sans-serif; font-weight:600;
    cursor:pointer; box-shadow:0 0 18px var(--sg-glow);
    transition:transform .2s, box-shadow .2s, background .2s;
    display:flex; align-items:center; justify-content:center;
  }
  .sv-m-btn-confirm:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 24px rgba(255,107,53,.45); background:#ff855a; }
  .sv-m-btn-confirm:disabled { opacity:.45; cursor:not-allowed; box-shadow:none; transform:none; }

  /* review stars */
  .sv-stars-row { display:flex; gap:.5rem; justify-content:center; margin-bottom:1.1rem; }
  .sv-star-btn {
    font-size:2rem; background:none; border:none; cursor:pointer;
    transition:transform .15s;
  }
  .sv-star-btn:hover { transform:scale(1.2); }
  .sv-star-btn.on  { color:#ffbe0b; }
  .sv-star-btn.off { color:rgba(255,255,255,.1); }

  .sv-m-textarea {
    width:100%; background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:12px; padding:.72rem 1rem; color:var(--sg-text);
    font-family:'DM Sans',sans-serif; font-size:.9rem; outline:none;
    resize:none; transition:border-color .2s;
  }
  .sv-m-textarea:focus { border-color:rgba(255,107,53,.5); }
  .sv-m-textarea::placeholder { color:var(--sg-muted); }

  .sv-m-btn-submit {
    flex:1; padding:.78rem; border-radius:12px;
    background:rgba(255,190,11,.15); border:1px solid rgba(255,190,11,.3);
    color:var(--sg-accent2); font-family:'DM Sans',sans-serif;
    font-weight:600; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:.4rem;
    transition:background .2s;
  }
  .sv-m-btn-submit:hover { background:rgba(255,190,11,.25); }

  /* review list */
  .sv-review-item {
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:14px; padding:1rem 1.1rem; margin-bottom:.75rem;
  }
  .sv-review-top { display:flex; align-items:flex-start; justify-content:space-between; gap:.7rem; margin-bottom:.6rem; }
  .sv-reviewer-avatar {
    width:36px; height:36px; border-radius:50%;
    background:rgba(255,107,53,.15); border:1px solid rgba(255,107,53,.25);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:700; font-size:.85rem;
    color:var(--sg-accent); flex-shrink:0;
  }
  .sv-reviewer-name { font-size:.85rem; font-weight:600; color:var(--sg-text); }
  .sv-reviewer-date { font-size:.7rem; color:var(--sg-muted); }
  .sv-review-text { font-size:.82rem; color:var(--sg-muted); line-height:1.6; font-style:italic; }

  .sv-spinner {
    width:28px; height:28px; border-radius:50%;
    border:3px solid rgba(255,107,53,.2);
    border-top-color:var(--sg-accent);
    animation:sv-spin .7s linear infinite; margin:3rem auto;
  }
  @keyframes sv-spin { to { transform:rotate(360deg); } }
`;

function InjectSVStyle() {
  useEffect(() => {
    if (!document.getElementById("sv-style")) {
      const el = document.createElement("style");
      el.id = "sv-style";
      el.textContent = SV_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function Services() {
  const role = localStorage.getItem("role");
  const [services, setServices]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("");
  const [minRating, setMinRating]   = useState("");
  const [maxPrice, setMaxPrice]     = useState("");
  const [sort, setSort]             = useState("");

  const [selectedService, setSelectedService]           = useState<any>(null);
  const [addresses, setAddresses]                       = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [date, setDate]         = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isEmergency, setIsEmergency]   = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [reviewModal, setReviewModal]         = useState(false);
  const [reviewServiceId, setReviewServiceId] = useState<string | null>(null);
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState("");

  const [viewReviewsModal, setViewReviewsModal]     = useState(false);
  const [reviewsList, setReviewsList]               = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading]         = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search, category, minRating, maxPrice, sort });
      const res = await axios.get(`https://servixobackend.vercel.app/api/services?${params}`);
      setServices(res.data);
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  };

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://servixobackend.vercel.app/api/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
    } catch { console.log("No addresses"); }
  };

  useEffect(() => { fetchServices(); }, [search, category, minRating, maxPrice, sort]);
  useEffect(() => { fetchAddresses(); }, []);

  const handleConfirmBooking = async () => {
    if (!token) return toast.error("Please login first");
    if (selectedAddressIndex === null) return toast.error("Select address");
    if (!date) return toast.error("Select date");
    if (!timeSlot) return toast.error("Select time slot");
    try {
      setBookingLoading(true);
      await axios.post(
        "https://servixobackend.vercel.app/api/bookings",
        { serviceId: selectedService._id, address: addresses[selectedAddressIndex], date, timeSlot, isEmergency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking created 🎉");
      setSelectedService(null); setDate(""); setTimeSlot(""); setIsEmergency(false); setSelectedAddressIndex(null);
    } catch (e: any) { toast.error(e?.response?.data?.message || "Booking failed"); }
    finally { setBookingLoading(false); }
  };

  const submitReview = async () => {
    if (!token) return toast.error("Login required");
    try {
      await axios.post(
        "https://servixobackend.vercel.app/api/reviews",
        { serviceId: reviewServiceId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review added ⭐");
      setReviewModal(false); setComment(""); fetchServices();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Failed"); }
  };

  const fetchReviews = async (serviceId: string, serviceName: string) => {
    setReviewsLoading(true); setSelectedServiceName(serviceName);
    try {
      const res = await axios.get(`https://servixobackend.vercel.app/api/reviews/${serviceId}`);
      setReviewsList(res.data); setViewReviewsModal(true);
    } catch { toast.error("Failed to load reviews"); }
    finally { setReviewsLoading(false); }
  };

  const filtered = services.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  const categories = [
    { value:"", label:"All Categories", icon:"✨" },
    { value:"Plumbing", label:"Plumbing", icon:"🔧" },
    { value:"Electrician", label:"Electrical", icon:"⚡" },
    { value:"Cleaning", label:"Cleaning", icon:"🧹" },
    { value:"AC Repair", label:"AC & Appliances", icon:"❄️" },
    { value:"Painting", label:"Painting", icon:"🎨" },
    { value:"Carpentry", label:"Carpentry", icon:"🔨" },
  ];

  return (
    <>
      <InjectSVStyle />
      <div className="sv-root">

        {/* ── HERO ── */}
        <div className="sv-hero">
          <div className="sv-hero-tag"><Zap size={10}/> Trusted by 10,000+ customers</div>
          <h1 className="sv-hero-title">
            Find <em>Expert</em> Services
          </h1>
          <p className="sv-hero-sub">
            Browse our curated list of professional services and book with confidence.
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="sv-inner">
          <div className="sv-search-wrap">
            <div className="sv-search-row">
              <div className="sv-search-box">
                <Search size={16} style={{ color:"var(--sg-muted)", flexShrink:0 }} />
                <input
                  placeholder="Search services…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className={`sv-filter-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={15} /> Filters
                <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition:"transform .2s" }} />
              </button>
            </div>

            {showFilters && (
              <div className="sv-filters">
                <select className="sv-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
                <select className="sv-select" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                  <option value="">⭐ Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
                <input type="number" className="sv-filter-input" placeholder="💰 Max Price" onChange={(e) => setMaxPrice(e.target.value)} />
                <select className="sv-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">📊 Sort By</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            )}
          </div>

          {/* results count */}
          <p className="sv-count" style={{ marginTop:"1.5rem" }}>
            Showing <strong>{filtered.length}</strong> services
          </p>

          {/* ── SKELETON ── */}
          {loading && (
            <div className="sv-grid">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="sv-skeleton">
                  <div className="sv-skel-img" />
                  <div className="sv-skel-body">
                    <div className="sv-skel-line" style={{ width:"70%" }} />
                    <div className="sv-skel-line" style={{ width:"45%" }} />
                    <div className="sv-skel-line" style={{ width:"55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICE GRID ── */}
          {!loading && (
            <>
              {filtered.length === 0 ? (
                <div className="sv-empty">
                  <div className="sv-empty-icon"><Search size={28} style={{ color:"var(--sg-muted)" }} /></div>
                  <h3>No services found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="sv-grid" style={{ paddingBottom:"4rem" }}>
                  {filtered.map((s) => (
                    <div key={s._id} className="sv-card">
                      {/* image */}
                      <div className="sv-card-img">
                        <img src={s.image || "https://via.placeholder.com/400x300/12121a/888899?text=Service"} alt={s.title} />
                        <span className="sv-price-badge">₹{s.price}</span>
                        <span className="sv-cat-badge">{s.category || "Service"}</span>
                      </div>

                      {/* body */}
                      <div className="sv-card-body">
                        <h2 className="sv-card-title">{s.title}</h2>

                        <div className="sv-rating-row">
                          <div className="sv-rating-chip">
                            <Star size={12} style={{ fill:"#ffbe0b", color:"#ffbe0b" }} />
                            {s.averageRating ? s.averageRating.toFixed(1) : "0.0"}
                          </div>
                          <button className="sv-review-btn" onClick={() => fetchReviews(s._id, s.title)}>
                            {s.totalReviews || 0} reviews
                          </button>
                        </div>

                        <p className="sv-desc">{s.description}</p>

                        {/* provider */}
                        <div className="sv-provider">
                          <div className="sv-provider-avatar">
                            {s.provider?.name?.charAt(0).toUpperCase() || "P"}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            {s.provider?._id ? (
                              <Link to={`/provider/profile/${s.provider._id}`} className="sv-provider-name">
                                {s.provider?.name}
                              </Link>
                            ) : (
                              <span className="sv-provider-name">{s.provider?.name}</span>
                            )}
                            {s.provider?.isVerified && (
                              <div className="sv-verified">
                                <Shield size={10} /> Verified
                              </div>
                            )}
                          </div>
                        </div>

                        {/* actions */}
                        {role === "user" && (
                          <div className="sv-actions">
                            <button className="sv-btn-book" onClick={() => setSelectedService(s)}>
                              Book Now
                            </button>
                            <button className="sv-btn-review" onClick={() => { setReviewModal(true); setReviewServiceId(s._id); }}>
                              <Star size={13} /> Write a Review
                            </button>
                          </div>
                        )}
                        {(role === "provider" || role === "admin") && (
                          <div className="sv-role-badge">
                            {role === "provider" ? "Provider View" : "Admin View"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ══ BOOKING MODAL ══ */}
        {selectedService && (
          <div className="sv-overlay">
            <div className="sv-modal">
              <div className="sv-modal-head">
                <div>
                  <div className="sv-modal-title">Book Service</div>
                  <div className="sv-modal-sub">{selectedService.title}</div>
                </div>
                <button className="sv-modal-close" onClick={() => setSelectedService(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="sv-modal-body">
                <div className="sv-m-field">
                  <label className="sv-m-label"><MapPin size={12}/> Select Address</label>
                  <select className="sv-m-select" value={selectedAddressIndex ?? ""} onChange={(e) => setSelectedAddressIndex(e.target.value === "" ? null : Number(e.target.value))}>
                    <option value="">Choose an address</option>
                    {addresses.map((addr, i) => <option key={i} value={i}>{addr.label} — {addr.city}</option>)}
                  </select>
                </div>
                <div className="sv-m-field">
                  <label className="sv-m-label"><Calendar size={12}/> Select Date</label>
                  <input type="date" className="sv-m-input" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="sv-m-field">
                  <label className="sv-m-label"><Clock size={12}/> Time Slot</label>
                  <select className="sv-m-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                    <option value="">Select time</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 2:00 PM</option>
                    <option>2:00 PM - 4:00 PM</option>
                    <option>4:00 PM - 6:00 PM</option>
                  </select>
                </div>
                <label className="sv-emergency">
                  <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />
                  <div>
                    <div className="sv-emergency-label">🚨 Emergency Booking</div>
                    <div className="sv-emergency-sub">Priority service within 2 hours</div>
                  </div>
                </label>
              </div>
              <div className="sv-modal-foot">
                <div className="sv-modal-btns">
                  <button className="sv-m-btn-cancel" onClick={() => setSelectedService(null)}>Cancel</button>
                  <button className="sv-m-btn-confirm" disabled={bookingLoading} onClick={handleConfirmBooking}>
                    {bookingLoading
                      ? <div style={{ width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"sv-spin .7s linear infinite" }} />
                      : "Confirm Booking"
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ REVIEW MODAL ══ */}
        {reviewModal && (
          <div className="sv-overlay">
            <div className="sv-modal">
              <div className="sv-modal-head">
                <div>
                  <div className="sv-modal-title">Write a Review</div>
                  <div className="sv-modal-sub">Share your experience</div>
                </div>
                <button className="sv-modal-close" onClick={() => setReviewModal(false)}><X size={16}/></button>
              </div>
              <div className="sv-modal-body">
                <div className="sv-stars-row">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} className={`sv-star-btn ${star <= rating ? "on" : "off"}`} onClick={() => setRating(star)}>★</button>
                  ))}
                </div>
                <textarea
                  className="sv-m-textarea" rows={4}
                  placeholder="Share your experience…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="sv-modal-foot">
                <div className="sv-modal-btns">
                  <button className="sv-m-btn-cancel" onClick={() => setReviewModal(false)}>Cancel</button>
                  <button className="sv-m-btn-submit" onClick={submitReview}>
                    <Star size={14}/> Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ VIEW REVIEWS MODAL ══ */}
        {viewReviewsModal && (
          <div className="sv-overlay">
            <div className="sv-modal sv-modal-lg">
              <div className="sv-modal-head">
                <div>
                  <div className="sv-modal-title">Reviews</div>
                  <div className="sv-modal-sub">{selectedServiceName}</div>
                </div>
                <button className="sv-modal-close" onClick={() => setViewReviewsModal(false)}><X size={16}/></button>
              </div>
              <div className="sv-modal-body">
                {reviewsLoading ? (
                  <div className="sv-spinner" />
                ) : reviewsList.length === 0 ? (
                  <div className="sv-empty" style={{ padding:"3rem 1rem" }}>
                    <div className="sv-empty-icon"><Star size={24} style={{ color:"var(--sg-muted)" }}/></div>
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this service</p>
                  </div>
                ) : (
                  reviewsList.map((review) => (
                    <div key={review._id} className="sv-review-item">
                      <div className="sv-review-top">
                        <div style={{ display:"flex", alignItems:"center", gap:".7rem" }}>
                          <div className="sv-reviewer-avatar">
                            {review.user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="sv-reviewer-name">{review.user?.name || "Anonymous"}</div>
                            <div className="sv-reviewer-date">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="sv-rating-chip">
                          <Star size={11} style={{ fill:"#ffbe0b", color:"#ffbe0b" }} />
                          {review.rating}
                        </div>
                      </div>
                      <p className="sv-review-text">"{review.comment || "No comment provided"}"</p>
                    </div>
                  ))
                )}
              </div>
              <div className="sv-modal-foot">
                <button className="sv-m-btn-cancel" style={{ width:"100%" }} onClick={() => setViewReviewsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Services;