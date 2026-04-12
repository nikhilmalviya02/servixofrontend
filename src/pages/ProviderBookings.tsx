import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BookingTimeline from "../components/BookingTimeline";
import {
  CalendarDays, CheckCircle, XCircle, Clock,
  Zap, User, Calendar, AlarmClock, ClipboardList,
} from "lucide-react";

/* ─── Styles ─── */
const PB_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

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

  .pb-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding: 4rem 4% 4rem;
    position: relative;
  }
  @media(max-width:768px) {
    .pb-root {
      padding: 3rem 3% 3rem;
    }
  }
  .pb-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 85% 10%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 5%  85%, rgba(14,165,233,.06) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .pb-wrap { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

  /* ── HEADER ── */
  .pb-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .pb-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.25);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  @media(max-width:768px) {
    .pb-header-icon {
      width: 40px; height: 40px;
    }
  }
  .pb-page-title {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: clamp(1.3rem, 4vw, 1.8rem); letter-spacing: -1px; color: var(--sg-text);
  }
  .pb-page-sub { color: var(--sg-muted); font-size: .8rem; margin-top: .15rem; }

  /* ── STATS ── */
  .pb-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  @media(min-width:768px) {
    .pb-stats { grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); }
  }

  .pb-stat {
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 14px; padding: 1rem; text-align: center;
    transition: border-color .25s, box-shadow .25s;
  }
  .pb-stat:hover { border-color: rgba(59,130,246,.2); box-shadow: 0 4px 20px rgba(0,0,0,.1); }
  .pb-stat-val {
    font-family: 'Inter', sans-serif; font-weight: 800; font-size: clamp(1.4rem, 3vw, 1.8rem);
    letter-spacing: -.5px; line-height: 1;
  }
  .pb-stat-label { font-size: .68rem; color: var(--sg-muted); margin-top: .3rem; letter-spacing: .4px; text-transform: uppercase; }

  /* ── SPINNER ── */
  .pb-spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid rgba(59,130,246,.2); border-top-color: var(--sg-accent);
    animation: pb-spin .7s linear infinite; margin: 3rem auto;
  }
  @keyframes pb-spin { to { transform: rotate(360deg); } }

  /* ── EMPTY ── */
  .pb-empty { text-align: center; padding: 3rem 1.5rem; }
  .pb-empty-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(59,130,246,.04); border: 1px solid var(--sg-border);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  @media(max-width:768px) {
    .pb-empty-icon {
      width: 48px; height: 48px;
    }
  }
  .pb-empty h3 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: .9rem; color: var(--sg-text); }
  .pb-empty p  { color: var(--sg-muted); font-size: .8rem; margin-top: .3rem; }

  /* ── GRID ── */
  .pb-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  @media(min-width:768px) { .pb-grid { grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.2rem; } }

  /* ── BOOKING CARD ── */
  .pb-card {
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 18px; padding: 1.2rem;
    transition: border-color .25s, box-shadow .25s;
  }
  .pb-card:hover { border-color: rgba(59,130,246,.18); box-shadow: 0 8px 32px rgba(0,0,0,.15); }
  .pb-card.emergency { border-color: rgba(59,130,246,.3); }
  .pb-card.emergency:hover { border-color: rgba(59,130,246,.5); }
  @media(max-width:768px) {
    .pb-card {
      padding: 1rem;
      border-radius: 16px;
    }
  }

  /* card top */
  .pb-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .pb-card-title {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: .9rem; color: var(--sg-text);
  }
  @media(max-width:768px) {
    .pb-card-title {
      font-size: .85rem;
    }
  }

  /* emergency badge */
  .pb-emg {
    display: inline-flex; align-items: center; gap: .35rem;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.25);
    border-radius: 100px; padding: .2rem .6rem;
    font-size: .65rem; font-weight: 700; color: #3b82f6;
    margin-top: .35rem;
  }
  @media(max-width:768px) {
    .pb-emg {
      font-size: .6rem;
      padding: .15rem .5rem;
    }
  }

  /* status badge */
  .pb-status {
    font-size: .65rem; font-weight: 600; padding: .2rem .6rem;
    border-radius: 100px; white-space: nowrap; text-transform: capitalize;
    flex-shrink: 0;
  }
  @media(max-width:768px) {
    .pb-status {
      font-size: .6rem;
      padding: .15rem .5rem;
    }
  }
  .pb-status-pending   { background: rgba(59,130,246,.1);  border: 1px solid rgba(59,130,246,.25);  color: var(--sg-accent2); }
  .pb-status-accepted  { background: rgba(14,165,233,.1);  border: 1px solid rgba(14,165,233,.25);  color: #0ea5e9; }
  .pb-status-completed { background: rgba(0,212,255,.1);   border: 1px solid rgba(0,212,255,.25);   color: var(--sg-cyan); }
  .pb-status-rejected  { background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.25); color: #3b82f6; }
  .pb-status-cancelled { background: rgba(255,255,255,.06);border: 1px solid var(--sg-border);      color: var(--sg-muted); }

  /* meta chips */
  .pb-meta { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
  .pb-chip {
    display: flex; align-items: center; gap: .3rem;
    background: rgba(255,255,255,.04); border: 1px solid var(--sg-border);
    border-radius: 100px; padding: .25rem .7rem;
    font-size: .7rem; color: var(--sg-muted);
  }
  .pb-chip strong { color: var(--sg-text); font-weight: 600; }
  @media(max-width:768px) {
    .pb-chip {
      font-size: .65rem;
      padding: .2rem .6rem;
    }
  }

  /* divider */
  .pb-hr { border: none; border-top: 1px solid var(--sg-border); margin: .8rem 0; }

  /* action buttons */
  .pb-actions { display: flex; gap: .6rem; margin-top: 1rem; flex-wrap: wrap; }

  .pb-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: .3rem;
    padding: .6rem; border-radius: 10px; border: 1px solid;
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: .8rem;
    cursor: pointer; transition: transform .15s, background .2s;
    min-width: 120px;
  }
  .pb-btn:hover { transform: translateY(-1px); }
  @media(max-width:768px) {
    .pb-btn {
      font-size: .75rem;
      padding: .5rem;
      min-width: 100px;
    }
  }

  .pb-btn-accept {
    background: rgba(14,165,233,.1); border-color: rgba(14,165,233,.25); color: #0ea5e9;
  }
  .pb-btn-accept:hover { background: rgba(14,165,233,.18); }

  .pb-btn-reject {
    background: rgba(59,130,246,.1); border-color: rgba(59,130,246,.25); color: #3b82f6;
  }
  .pb-btn-reject:hover { background: rgba(59,130,246,.18); }

  .pb-btn-complete {
    background: rgba(0,212,255,.1); border-color: rgba(0,212,255,.25); color: var(--sg-cyan);
    box-shadow: 0 0 14px rgba(0,212,255,.15);
  }
  .pb-btn-complete:hover { background: rgba(0,212,255,.18); box-shadow: 0 0 20px rgba(0,212,255,.25); }
`;

function InjectPBStyle() {
  useEffect(() => {
    if (!document.getElementById("pb-style")) {
      const el = document.createElement("style");
      el.id = "pb-style";
      el.textContent = PB_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ── stat card helper ── */
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, { val: string }> = {
    orange: { val: "#3b82f6" },
    yellow: { val: "#f59e0b" },
    green:  { val: "#10b981" },
    cyan:   { val: "#06b6d4" },
    red:    { val: "#ef4444" },
  };
  return (
    <div className="pb-stat">
      <div className="pb-stat-val" style={{ color: colors[color]?.val ?? "var(--sg-text)" }}>{value}</div>
      <div className="pb-stat-label">{title}</div>
    </div>
  );
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending:   "pb-status pb-status-pending",
    accepted:  "pb-status pb-status-accepted",
    completed: "pb-status pb-status-completed",
    rejected:  "pb-status pb-status-rejected",
    cancelled: "pb-status pb-status-cancelled",
  };
  return map[status] ?? "pb-status pb-status-cancelled";
}

/* ══════════════════════════════
   COMPONENT
══════════════════════════════ */
function ProviderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://servixobackend.vercel.app/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch { toast.error("Update failed"); }
  };

  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    accepted:  bookings.filter((b) => b.status === "accepted").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected:  bookings.filter((b) => b.status === "rejected").length,
  }), [bookings]);

  return (
    <>
      <InjectPBStyle />
      <div className="pb-root">
        <div className="pb-wrap">

          {/* ── HEADER ── */}
          <div className="pb-header">
            <div className="pb-header-icon">
              <ClipboardList size={22} style={{ color: "#3b82f6" }} />
            </div>
            <div>
              <h1 className="pb-page-title">Provider Bookings</h1>
              <p className="pb-page-sub">Manage and respond to your customer requests</p>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="pb-stats">
            <StatCard title="Total"     value={stats.total}     color="orange" />
            <StatCard title="Pending"   value={stats.pending}   color="yellow" />
            <StatCard title="Accepted"  value={stats.accepted}  color="green"  />
            <StatCard title="Completed" value={stats.completed} color="cyan"   />
            <StatCard title="Rejected"  value={stats.rejected}  color="red"    />
          </div>

          {/* ── LOADING ── */}
          {loading && <div className="pb-spinner" />}

          {/* ── EMPTY ── */}
          {!loading && bookings.length === 0 && (
            <div className="pb-empty">
              <div className="pb-empty-icon">
                <CalendarDays size={28} style={{ color: "var(--sg-muted)" }} />
              </div>
              <h3>No bookings found</h3>
              <p>Bookings will appear here when customers request your services</p>
            </div>
          )}

          {/* ── BOOKING CARDS ── */}
          {!loading && bookings.length > 0 && (
            <div className="pb-grid">
              {bookings.map((b) => (
                <div key={b._id} className={`pb-card ${b.isEmergency ? "emergency" : ""}`}>

                  {/* Top row */}
                  <div className="pb-card-top">
                    <div>
                      <div className="pb-card-title">{b.service?.title}</div>
                      {b.isEmergency && (
                        <div className="pb-emg">
                          <Zap size={11} /> Emergency Booking
                        </div>
                      )}
                    </div>
                    <span className={statusClass(b.status)}>{b.status}</span>
                  </div>

                  {/* Meta chips */}
                  <div className="pb-meta">
                    <div className="pb-chip">
                      <User size={12} style={{ color: "#ff6b35" }} />
                      <strong>{b.user?.name}</strong>
                    </div>
                    <div className="pb-chip">
                      <Calendar size={12} style={{ color: "#4ade80" }} />
                      <strong>{new Date(b.date).toLocaleDateString()}</strong>
                    </div>
                    <div className="pb-chip">
                      <AlarmClock size={12} style={{ color: "#00d4ff" }} />
                      <strong>{b.timeSlot}</strong>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="pb-hr" />
                  <BookingTimeline status={b.status} />

                  {/* Actions */}
                  {b.status === "pending" && (
                    <div className="pb-actions">
                      <button className="pb-btn pb-btn-accept" onClick={() => updateStatus(b._id, "accepted")}>
                        <CheckCircle size={15} /> Accept
                      </button>
                      <button className="pb-btn pb-btn-reject" onClick={() => updateStatus(b._id, "rejected")}>
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  )}

                  {b.status === "accepted" && (
                    <div className="pb-actions">
                      <button className="pb-btn pb-btn-complete" onClick={() => updateStatus(b._id, "completed")}>
                        <Clock size={15} /> Mark Completed
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ProviderBookings;