import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AddService from "../components/AddService";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase, CalendarDays, Star, TrendingUp, Clock,
  CheckCircle, XCircle, AlertCircle, Plus, Trash2,
  ExternalLink, Filter, Search, ChevronRight,
  BarChart3, Zap,
} from "lucide-react";

/* ─── Styles ─── */
const PD_STYLE = `
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

  .pd-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    padding: 5.5rem 5% 4rem;
    position: relative;
  }
  .pd-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 85% 10%, rgba(255,107,53,.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 5%  85%, rgba(0,212,255,.07)  0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .pd-wrap { position:relative; z-index:1; max-width:1280px; margin:0 auto; }

  /* ── HEADER ── */
  .pd-header {
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:1rem; margin-bottom:2rem;
  }
  .pd-page-title {
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:clamp(1.6rem,3.5vw,2.2rem); letter-spacing:-1px; color:var(--sg-text);
  }
  .pd-page-sub { color:var(--sg-muted); font-size:.88rem; margin-top:.25rem; }

  .pd-add-btn {
    display:flex; align-items:center; gap:.45rem;
    padding:.62rem 1.3rem; border-radius:12px;
    background:var(--sg-accent); color:#fff; border:none;
    font-family:'DM Sans',sans-serif; font-weight:600; font-size:.88rem;
    cursor:pointer; box-shadow:0 0 18px var(--sg-glow);
    transition:transform .2s, box-shadow .2s, background .2s;
  }
  .pd-add-btn:hover { transform:translateY(-1px); box-shadow:0 4px 24px rgba(255,107,53,.45); background:#ff855a; }
  .pd-add-btn.cancel {
    background:rgba(255,255,255,.05); border:1px solid var(--sg-border);
    box-shadow:none; color:var(--sg-muted);
  }
  .pd-add-btn.cancel:hover { background:rgba(255,255,255,.09); box-shadow:none; color:var(--sg-text); }

  /* ── ANALYTICS GRID ── */
  .pd-analytics { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:1rem; margin-bottom:2rem; }

  .pd-stat-card {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:18px; padding:1.4rem;
    transition:border-color .25s, box-shadow .25s;
  }
  .pd-stat-card:hover { border-color:rgba(255,107,53,.2); box-shadow:0 6px 24px rgba(0,0,0,.3); }

  .pd-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.9rem; }
  .pd-stat-icon {
    width:40px; height:40px; border-radius:12px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .pd-stat-trend {
    font-size:.68rem; font-weight:600; padding:.18rem .55rem;
    border-radius:100px;
  }
  .pd-stat-trend.up   { background:rgba(74,222,128,.12); color:#4ade80; }
  .pd-stat-trend.down { background:rgba(255,107,107,.12); color:#ff6b6b; }

  .pd-stat-value {
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:1.7rem; letter-spacing:-.5px; color:var(--sg-text);
  }
  .pd-stat-label { font-size:.75rem; color:var(--sg-muted); margin-top:.2rem; letter-spacing:.3px; }

  /* ── ADD SERVICE FORM ── */
  .pd-add-form {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:20px; padding:1.6rem; margin-bottom:1.8rem;
  }
  .pd-add-form-head { display:flex; align-items:center; gap:.85rem; margin-bottom:1.4rem; }
  .pd-add-form-icon {
    width:40px; height:40px; border-radius:12px;
    background:rgba(255,107,53,.12); border:1px solid rgba(255,107,53,.25);
    display:flex; align-items:center; justify-content:center;
  }
  .pd-add-form-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.97rem; color:var(--sg-text); }
  .pd-add-form-sub   { font-size:.75rem; color:var(--sg-muted); margin-top:.1rem; }

  /* ── MAIN GRID ── */
  .pd-main-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; }
  @media(min-width:1024px){ .pd-main-grid { grid-template-columns:1fr 1fr 1fr; } }

  .pd-col-left  { display:flex; flex-direction:column; gap:1.5rem; }
  .pd-col-right { display:flex; flex-direction:column; gap:1.5rem; }
  @media(min-width:1024px){
    .pd-col-left  { grid-column: span 2; }
    .pd-col-right { grid-column: span 1; }
  }

  /* ── SECTION CARDS ── */
  .pd-card {
    background:var(--sg-surface); border:1px solid var(--sg-border);
    border-radius:20px; padding:1.5rem;
  }
  .pd-card-head {
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:.8rem; margin-bottom:1.3rem;
  }
  .pd-card-head-left { display:flex; align-items:center; gap:.8rem; }
  .pd-card-head-icon {
    width:38px; height:38px; border-radius:11px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .pd-card-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.97rem; color:var(--sg-text); }
  .pd-card-sub   { font-size:.75rem; color:var(--sg-muted); margin-top:.1rem; }

  .pd-link-btn {
    display:flex; align-items:center; gap:.35rem;
    color:var(--sg-accent); text-decoration:none; font-size:.8rem; font-weight:600;
    padding:.38rem .9rem; border-radius:100px;
    border:1px solid rgba(255,107,53,.25);
    background:rgba(255,107,53,.07);
    transition:background .2s, border-color .2s;
    white-space:nowrap;
  }
  .pd-link-btn:hover { background:rgba(255,107,53,.14); }

  /* ── SERVICE ROWS ── */
  .pd-svc-row {
    display:flex; align-items:center; gap:1rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:14px; padding:1rem 1.1rem; margin-bottom:.7rem;
    transition:border-color .2s;
  }
  .pd-svc-row:hover { border-color:rgba(255,107,53,.18); }

  .pd-svc-icon {
    width:40px; height:40px; border-radius:12px; flex-shrink:0;
    background:rgba(255,107,53,.1); border:1px solid rgba(255,107,53,.2);
    display:flex; align-items:center; justify-content:center;
  }
  .pd-svc-name { font-family:'Syne',sans-serif; font-weight:700; font-size:.88rem; color:var(--sg-text); }
  .pd-svc-cat  {
    font-size:.65rem; font-weight:600; padding:.15rem .55rem;
    border-radius:100px; background:rgba(255,255,255,.06);
    border:1px solid var(--sg-border); color:var(--sg-muted);
    margin-left:.4rem;
  }
  .pd-svc-desc { font-size:.76rem; color:var(--sg-muted); margin-top:.15rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:280px; }
  .pd-svc-price { font-family:'Syne',sans-serif; font-weight:700; font-size:.92rem; color:var(--sg-accent); }
  .pd-svc-rating { display:flex; align-items:center; gap:.25rem; font-size:.73rem; color:var(--sg-muted); margin-top:.15rem; }

  .pd-del-btn {
    width:32px; height:32px; border-radius:9px; flex-shrink:0;
    background:none; border:1px solid var(--sg-border); cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    color:var(--sg-muted); transition:background .2s, border-color .2s, color .2s;
  }
  .pd-del-btn:hover { background:rgba(255,107,107,.1); border-color:rgba(255,107,107,.25); color:#ff6b6b; }

  /* ── SEARCH + FILTER ── */
  .pd-search-row { display:flex; flex-wrap:wrap; gap:.7rem; margin-bottom:1rem; }
  .pd-search-box {
    flex:1; display:flex; align-items:center; gap:.6rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:11px; padding:.6rem .9rem; min-width:160px;
    transition:border-color .2s;
  }
  .pd-search-box:focus-within { border-color:rgba(255,107,53,.4); }
  .pd-search-box input {
    flex:1; background:none; border:none; outline:none;
    color:var(--sg-text); font-family:'DM Sans',sans-serif; font-size:.85rem;
  }
  .pd-search-box input::placeholder { color:var(--sg-muted); }
  .pd-filter-select {
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:11px; padding:.6rem .9rem;
    color:var(--sg-text); font-family:'DM Sans',sans-serif; font-size:.82rem;
    outline:none; appearance:none; cursor:pointer; transition:border-color .2s;
    min-width:130px;
  }
  .pd-filter-select:focus { border-color:rgba(255,107,53,.4); }
  .pd-filter-select option { background:#1a1a26; }

  /* ── BOOKING ROWS ── */
  .pd-booking-row {
    display:flex; flex-wrap:wrap; align-items:center; gap:.9rem;
    background:var(--sg-surface2); border:1px solid var(--sg-border);
    border-radius:14px; padding:1rem 1.1rem; margin-bottom:.7rem;
    transition:border-color .2s;
  }
  .pd-booking-row:hover { border-color:rgba(255,107,53,.15); }
  .pd-booking-row.emergency { border-color:rgba(255,107,107,.2); background:rgba(255,107,107,.05); }

  .pd-booking-icon {
    width:38px; height:38px; border-radius:11px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
  }
  .pd-booking-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.87rem; color:var(--sg-text); display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; }
  .pd-booking-meta  { font-size:.74rem; color:var(--sg-muted); margin-top:.1rem; }

  .pd-emg-badge {
    font-size:.62rem; font-weight:700; padding:.15rem .5rem;
    border-radius:100px; background:rgba(255,107,107,.12);
    border:1px solid rgba(255,107,107,.25); color:#ff6b6b;
  }

  .pd-status-badge {
    font-size:.68rem; font-weight:600; padding:.2rem .65rem;
    border-radius:100px; white-space:nowrap;
    text-transform:capitalize;
  }
  .pd-status-pending   { background:rgba(255,190,11,.1);  border:1px solid rgba(255,190,11,.2);  color:var(--sg-accent2); }
  .pd-status-accepted  { background:rgba(74,222,128,.1);  border:1px solid rgba(74,222,128,.2);  color:#4ade80; }
  .pd-status-completed { background:rgba(0,212,255,.1);   border:1px solid rgba(0,212,255,.2);   color:var(--sg-cyan); }
  .pd-status-rejected  { background:rgba(255,107,107,.1); border:1px solid rgba(255,107,107,.2); color:#ff6b6b; }
  .pd-status-cancelled { background:rgba(255,255,255,.06);border:1px solid var(--sg-border);      color:var(--sg-muted); }

  .pd-action-btns { display:flex; gap:.4rem; margin-left:auto; }
  .pd-action-btn {
    width:30px; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--sg-border); background:none; cursor:pointer;
    color:var(--sg-muted); transition:background .2s, border-color .2s, color .2s;
  }
  .pd-action-btn.accept:hover  { background:rgba(74,222,128,.1); border-color:rgba(74,222,128,.25); color:#4ade80; }
  .pd-action-btn.reject:hover  { background:rgba(255,107,107,.1); border-color:rgba(255,107,107,.25); color:#ff6b6b; }
  .pd-complete-btn {
    font-size:.75rem; font-weight:600; padding:.3rem .85rem;
    background:rgba(0,212,255,.1); border:1px solid rgba(0,212,255,.2);
    border-radius:100px; color:var(--sg-cyan); cursor:pointer;
    transition:background .2s; white-space:nowrap;
  }
  .pd-complete-btn:hover { background:rgba(0,212,255,.18); }

  /* ── STATUS BREAKDOWN ── */
  .pd-status-rows { display:flex; flex-direction:column; gap:1rem; }
  .pd-status-row-item { }
  .pd-status-row-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:.45rem; }
  .pd-status-row-left { display:flex; align-items:center; gap:.6rem; }
  .pd-status-row-icon {
    width:30px; height:30px; border-radius:9px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
  }
  .pd-status-row-label { font-size:.82rem; color:var(--sg-muted); }
  .pd-status-row-count { font-size:.82rem; font-weight:700; color:var(--sg-text); }
  .pd-bar-track { height:5px; background:rgba(255,255,255,.06); border-radius:100px; overflow:hidden; }
  .pd-bar-fill  { height:100%; border-radius:100px; transition:width .6s ease; }

  /* ── PRO TIPS ── */
  .pd-tips {
    background:rgba(255,107,53,.06); border:1px solid rgba(255,107,53,.15);
    border-radius:20px; padding:1.5rem;
  }
  .pd-tips-head { display:flex; align-items:center; gap:.75rem; margin-bottom:1rem; }
  .pd-tips-icon {
    width:38px; height:38px; border-radius:11px;
    background:rgba(255,107,53,.12); border:1px solid rgba(255,107,53,.2);
    display:flex; align-items:center; justify-content:center;
  }
  .pd-tips-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem; color:var(--sg-text); }
  .pd-tips ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.7rem; }
  .pd-tips li { display:flex; align-items:flex-start; gap:.6rem; font-size:.8rem; color:var(--sg-muted); line-height:1.55; }
  .pd-tips li::before { content:'→'; color:var(--sg-accent); flex-shrink:0; font-weight:700; }

  /* ── PERFORMANCE BARS ── */
  .pd-perf { background:var(--sg-surface); border:1px solid var(--sg-border); border-radius:20px; padding:1.5rem; }
  .pd-perf-head { display:flex; align-items:center; gap:.75rem; margin-bottom:1.2rem; }
  .pd-perf-icon { width:38px; height:38px; border-radius:11px; background:rgba(74,222,128,.1); border:1px solid rgba(74,222,128,.2); display:flex; align-items:center; justify-content:center; }
  .pd-perf-title { font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem; color:var(--sg-text); }
  .pd-perf-rows { display:flex; flex-direction:column; gap:1rem; }
  .pd-perf-row-top { display:flex; justify-content:space-between; margin-bottom:.4rem; font-size:.78rem; }
  .pd-perf-row-label { color:var(--sg-muted); }
  .pd-perf-row-val   { font-weight:600; color:var(--sg-text); }

  /* empty */
  .pd-empty {
    text-align:center; padding:2.5rem 1rem;
    background:rgba(255,255,255,.02); border:1px dashed var(--sg-border);
    border-radius:16px;
  }
  .pd-empty-icon { color:var(--sg-muted); margin-bottom:.7rem; }
  .pd-empty h4 { font-family:'Syne',sans-serif; font-weight:700; font-size:.9rem; color:var(--sg-text); }
  .pd-empty p  { font-size:.78rem; color:var(--sg-muted); margin-top:.25rem; }
  .pd-empty-btn {
    margin-top:.9rem; display:inline-flex; align-items:center; gap:.4rem;
    background:var(--sg-accent); color:#fff; border:none; border-radius:10px;
    padding:.6rem 1.2rem; font-family:'DM Sans',sans-serif;
    font-weight:600; font-size:.83rem; cursor:pointer;
    box-shadow:0 0 14px var(--sg-glow); transition:background .2s;
  }
  .pd-empty-btn:hover { background:#ff855a; }

  /* spinner */
  .pd-spinner {
    width:28px; height:28px; border-radius:50%;
    border:3px solid rgba(255,107,53,.2); border-top-color:var(--sg-accent);
    animation:pd-spin .7s linear infinite; margin:2rem auto;
  }
  @keyframes pd-spin { to { transform:rotate(360deg); } }
`;

function InjectPDStyle() {
  useEffect(() => {
    if (!document.getElementById("pd-style")) {
      const el = document.createElement("style");
      el.id = "pd-style";
      el.textContent = PD_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── sub-components ── */
function StatCard({ title, value, icon: Icon, trend, trendUp, iconBg, iconColor }: {
  title: string; value: string | number;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
  iconBg: string; iconColor: string;
}) {
  return (
    <div className="pd-stat-card">
      <div className="pd-stat-top">
        <div className="pd-stat-icon" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {trend && (
          <span className={`pd-stat-trend ${trendUp ? "up" : "down"}`}>{trend}</span>
        )}
      </div>
      <div className="pd-stat-value">{value}</div>
      <div className="pd-stat-label">{title}</div>
    </div>
  );
}

function StatusRow({ label, count, total, barColor, iconBg, iconColor, icon: Icon }: {
  label: string; count: number; total: number;
  barColor: string; iconBg: string; iconColor: string;
  icon: React.ElementType;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="pd-status-row-item">
      <div className="pd-status-row-top">
        <div className="pd-status-row-left">
          <div className="pd-status-row-icon" style={{ background: iconBg }}>
            <Icon size={14} style={{ color: iconColor }} />
          </div>
          <span className="pd-status-row-label">{label}</span>
        </div>
        <span className="pd-status-row-count">{count}</span>
      </div>
      <div className="pd-bar-track">
        <div className="pd-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    pending:   "pd-status-badge pd-status-pending",
    accepted:  "pd-status-badge pd-status-accepted",
    completed: "pd-status-badge pd-status-completed",
    rejected:  "pd-status-badge pd-status-rejected",
    cancelled: "pd-status-badge pd-status-cancelled",
  };
  return map[status] ?? "pd-status-badge pd-status-cancelled";
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
interface Service {
  _id: string; title: string; description: string;
  category: string; price: number;
  averageRating: number; totalReviews: number; createdAt: string;
}
interface Booking {
  _id: string; service: { title: string; price?: number };
  user: { name: string }; status: string; date: string; isEmergency: boolean;
}

function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices]     = useState<Service[]>([]);
  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const svcRes = await axios.get("https://servixobackend.vercel.app/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(svcRes.data.filter((s: any) => s.provider?._id === user?.id || s.provider === user?.id));

      const bkRes = await axios.get("https://servixobackend.vercel.app/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bkRes.data.slice(0, 5));
    } catch { toast.error("Failed to load dashboard data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed");
    const earnings  = completed.reduce((a, b) => a + (b.service?.price || 0), 0);
    return {
      totalServices:     services.length,
      totalBookings:     bookings.length,
      pendingBookings:   bookings.filter((b) => b.status === "pending").length,
      acceptedBookings:  bookings.filter((b) => b.status === "accepted").length,
      completedBookings: completed.length,
      rejectedBookings:  bookings.filter((b) => b.status === "rejected").length,
      averageRating: services.length > 0
        ? (services.reduce((a, s) => a + (s.averageRating || 0), 0) / services.length).toFixed(1)
        : "0.0",
      totalEarnings: earnings,
      conversionRate: bookings.length > 0
        ? Math.round((completed.length / bookings.length) * 100) : 0,
    };
  }, [services, bookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch = b.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await axios.delete(`https://servixobackend.vercel.app/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted");
      fetchData();
    } catch { toast.error("Delete failed"); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.put(`https://servixobackend.vercel.app/api/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch { toast.error("Update failed"); }
  };

  return (
    <>
      <InjectPDStyle />
      <div className="pd-root">
        <div className="pd-wrap">

          {/* ── HEADER ── */}
          <div className="pd-header">
            <div>
              <h1 className="pd-page-title">Provider Dashboard</h1>
              <p className="pd-page-sub">Manage services, track performance & handle bookings</p>
            </div>
            <button
              className={`pd-add-btn ${showAddForm ? "cancel" : ""}`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={15} /> {showAddForm ? "Cancel" : "Add Service"}
            </button>
          </div>

          {/* ── ANALYTICS ── */}
          <div className="pd-analytics">
            <StatCard title="Total Earnings"    value={`₹${stats.totalEarnings.toLocaleString()}`} icon={TrendingUp} trend="+12%" trendUp iconBg="rgba(74,222,128,.12)"   iconColor="#4ade80" />
            <StatCard title="Active Services"   value={stats.totalServices}    icon={Briefcase}  iconBg="rgba(255,107,53,.12)"  iconColor="#ff6b35" />
            <StatCard title="Conversion Rate"   value={`${stats.conversionRate}%`} icon={BarChart3} trend="+5%" trendUp iconBg="rgba(0,212,255,.12)" iconColor="#00d4ff" />
            <StatCard title="Avg Rating"        value={stats.averageRating}    icon={Star}       iconBg="rgba(255,190,11,.12)"  iconColor="#ffbe0b" />
          </div>

          {/* ── ADD SERVICE FORM ── */}
          {showAddForm && (
            <div className="pd-add-form">
              <div className="pd-add-form-head">
                <div className="pd-add-form-icon"><Plus size={17} style={{ color:"#ff6b35" }} /></div>
                <div>
                  <div className="pd-add-form-title">Add New Service</div>
                  <div className="pd-add-form-sub">Create a new service offering for customers</div>
                </div>
              </div>
              <AddService compact onServiceAdded={() => { fetchData(); setShowAddForm(false); }} />
            </div>
          )}

          {/* ── MAIN GRID ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"1.5rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.5rem", alignItems:"start" }}>

              {/* LEFT ─ Services + Bookings */}
              <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem", gridColumn:"span 2" }}>

                {/* My Services */}
                <div className="pd-card">
                  <div className="pd-card-head">
                    <div className="pd-card-head-left">
                      <div className="pd-card-head-icon" style={{ background:"rgba(255,107,53,.1)", border:"1px solid rgba(255,107,53,.2)" }}>
                        <Briefcase size={17} style={{ color:"#ff6b35" }} />
                      </div>
                      <div>
                        <div className="pd-card-title">My Services</div>
                        <div className="pd-card-sub">Manage your service listings</div>
                      </div>
                    </div>
                    <Link to="/services" className="pd-link-btn">
                      <ExternalLink size={13} /> Browse
                    </Link>
                  </div>

                  {loading ? <div className="pd-spinner" /> :
                   services.length === 0 ? (
                    <div className="pd-empty">
                      <div className="pd-empty-icon"><Briefcase size={32} /></div>
                      <h4>No services yet</h4>
                      <p>Add your first service to start receiving bookings</p>
                      <button className="pd-empty-btn" onClick={() => setShowAddForm(true)}>
                        <Plus size={14} /> Add Service
                      </button>
                    </div>
                  ) : (
                    services.map((s) => (
                      <div key={s._id} className="pd-svc-row">
                        <div className="pd-svc-icon"><Briefcase size={18} style={{ color:"#ff6b35" }} /></div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap" }}>
                            <span className="pd-svc-name">{s.title}</span>
                            <span className="pd-svc-cat">{s.category}</span>
                          </div>
                          <div className="pd-svc-desc">{s.description}</div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div className="pd-svc-price">₹{s.price}</div>
                          <div className="pd-svc-rating">
                            <Star size={11} style={{ fill:"#ffbe0b", color:"#ffbe0b" }} />
                            {s.averageRating?.toFixed(1) || "0.0"}
                            <span style={{ opacity:.5 }}>({s.totalReviews || 0})</span>
                          </div>
                        </div>
                        <button className="pd-del-btn" onClick={() => handleDeleteService(s._id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Booking Management */}
                <div className="pd-card">
                  <div className="pd-card-head">
                    <div className="pd-card-head-left">
                      <div className="pd-card-head-icon" style={{ background:"rgba(0,212,255,.1)", border:"1px solid rgba(0,212,255,.2)" }}>
                        <CalendarDays size={17} style={{ color:"#00d4ff" }} />
                      </div>
                      <div>
                        <div className="pd-card-title">Booking Requests</div>
                        <div className="pd-card-sub">Manage and respond to customers</div>
                      </div>
                    </div>
                    <Link to="/provider/bookings" className="pd-link-btn">
                      View All <ChevronRight size={13} />
                    </Link>
                  </div>

                  {/* search + filter */}
                  <div className="pd-search-row">
                    <div className="pd-search-box">
                      <Search size={14} style={{ color:"var(--sg-muted)", flexShrink:0 }} />
                      <input
                        placeholder="Search bookings…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                      <Filter size={13} style={{ color:"var(--sg-muted)" }} />
                      <select className="pd-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {loading ? <div className="pd-spinner" /> :
                   filteredBookings.length === 0 ? (
                    <div className="pd-empty">
                      <div className="pd-empty-icon"><CalendarDays size={32} /></div>
                      <h4>No bookings found</h4>
                      <p>{searchQuery || filterStatus !== "all" ? "Try adjusting filters" : "Bookings will appear here"}</p>
                    </div>
                  ) : (
                    filteredBookings.slice(0, 6).map((b) => (
                      <div key={b._id} className={`pd-booking-row ${b.isEmergency ? "emergency" : ""}`}>
                        <div className="pd-booking-icon" style={{ background: b.isEmergency ? "rgba(255,107,107,.12)" : "rgba(0,212,255,.1)" }}>
                          {b.isEmergency
                            ? <Zap size={16} style={{ color:"#ff6b6b" }} />
                            : <CalendarDays size={16} style={{ color:"#00d4ff" }} />}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="pd-booking-title">
                            {b.service?.title}
                            {b.isEmergency && <span className="pd-emg-badge">Emergency</span>}
                          </div>
                          <div className="pd-booking-meta">
                            {b.user?.name} • {new Date(b.date).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={statusBadgeClass(b.status)}>{b.status}</span>
                        {b.status === "pending" && (
                          <div className="pd-action-btns">
                            <button className="pd-action-btn accept" onClick={() => updateBookingStatus(b._id, "accepted")} title="Accept">
                              <CheckCircle size={14} />
                            </button>
                            <button className="pd-action-btn reject" onClick={() => updateBookingStatus(b._id, "rejected")} title="Reject">
                              <XCircle size={14} />
                            </button>
                          </div>
                        )}
                        {b.status === "accepted" && (
                          <button className="pd-complete-btn" onClick={() => updateBookingStatus(b._id, "completed")}>
                            Complete
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT ─ Status + Tips + Performance */}
              <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

                {/* Status Breakdown */}
                <div className="pd-card">
                  <div className="pd-card-head">
                    <div className="pd-card-head-left">
                      <div className="pd-card-head-icon" style={{ background:"rgba(180,120,255,.1)", border:"1px solid rgba(180,120,255,.2)" }}>
                        <BarChart3 size={17} style={{ color:"#b478ff" }} />
                      </div>
                      <div>
                        <div className="pd-card-title">Booking Status</div>
                        <div className="pd-card-sub">Overview of all bookings</div>
                      </div>
                    </div>
                  </div>
                  <div className="pd-status-rows">
                    <StatusRow label="Pending"   count={stats.pendingBookings}   total={stats.totalBookings} barColor="#ffbe0b" iconBg="rgba(255,190,11,.1)"  iconColor="#ffbe0b" icon={Clock} />
                    <StatusRow label="Accepted"  count={stats.acceptedBookings}  total={stats.totalBookings} barColor="#00d4ff" iconBg="rgba(0,212,255,.1)"   iconColor="#00d4ff" icon={CheckCircle} />
                    <StatusRow label="Completed" count={stats.completedBookings} total={stats.totalBookings} barColor="#4ade80" iconBg="rgba(74,222,128,.1)"  iconColor="#4ade80" icon={CheckCircle} />
                    <StatusRow label="Rejected"  count={stats.rejectedBookings}  total={stats.totalBookings} barColor="#ff6b6b" iconBg="rgba(255,107,107,.1)" iconColor="#ff6b6b" icon={XCircle} />
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="pd-tips">
                  <div className="pd-tips-head">
                    <div className="pd-tips-icon"><AlertCircle size={17} style={{ color:"#ff6b35" }} /></div>
                    <div className="pd-tips-title">Pro Tips</div>
                  </div>
                  <ul>
                    <li>Respond to bookings within 24 hours for better ratings</li>
                    <li>Mark completed jobs promptly to track earnings</li>
                    <li>Add detailed descriptions to attract more customers</li>
                    <li>Emergency bookings often lead to repeat customers</li>
                  </ul>
                </div>

                {/* Performance */}
                <div className="pd-perf">
                  <div className="pd-perf-head">
                    <div className="pd-perf-icon"><TrendingUp size={17} style={{ color:"#4ade80" }} /></div>
                    <div className="pd-perf-title">Performance</div>
                  </div>
                  <div className="pd-perf-rows">
                    {[
                      { label:"Response Rate",        val:"92%",                    pct:92,                                                           color:"#4ade80" },
                      { label:"Completion Rate",      val:`${stats.conversionRate}%`,pct:stats.conversionRate,                                        color:"#00d4ff" },
                      { label:"Customer Satisfaction",val:`${stats.averageRating}/5`,pct:(parseFloat(stats.averageRating as string)/5)*100,           color:"#ffbe0b" },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="pd-perf-row-top">
                          <span className="pd-perf-row-label">{row.label}</span>
                          <span className="pd-perf-row-val">{row.val}</span>
                        </div>
                        <div className="pd-bar-track">
                          <div className="pd-bar-fill" style={{ width:`${row.pct}%`, background:row.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ProviderDashboard;