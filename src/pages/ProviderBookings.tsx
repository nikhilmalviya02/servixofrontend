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

  .pb-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    padding: 5.5rem 5% 4rem;
    position: relative;
  }
  .pb-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 85% 10%, rgba(255,107,53,.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 5%  85%, rgba(0,212,255,.07)  0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .pb-wrap { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

  /* ── HEADER ── */
  .pb-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
  .pb-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: rgba(255,107,53,.12); border: 1px solid rgba(255,107,53,.25);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pb-page-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -1px; color: var(--sg-text);
  }
  .pb-page-sub { color: var(--sg-muted); font-size: .85rem; margin-top: .15rem; }

  /* ── STATS ── */
  .pb-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap: 1rem; margin-bottom: 2rem; }

  .pb-stat {
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 16px; padding: 1.1rem 1rem; text-align: center;
    transition: border-color .25s, box-shadow .25s;
  }
  .pb-stat:hover { border-color: rgba(255,107,53,.2); box-shadow: 0 4px 20px rgba(0,0,0,.3); }
  .pb-stat-val {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.8rem;
    letter-spacing: -.5px; line-height: 1;
  }
  .pb-stat-label { font-size: .72rem; color: var(--sg-muted); margin-top: .3rem; letter-spacing: .4px; text-transform: uppercase; }

  /* ── SPINNER ── */
  .pb-spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid rgba(255,107,53,.2); border-top-color: var(--sg-accent);
    animation: pb-spin .7s linear infinite; margin: 4rem auto;
  }
  @keyframes pb-spin { to { transform: rotate(360deg); } }

  /* ── EMPTY ── */
  .pb-empty { text-align: center; padding: 4rem 2rem; }
  .pb-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,.04); border: 1px solid var(--sg-border);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .pb-empty h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: var(--sg-text); }
  .pb-empty p  { color: var(--sg-muted); font-size: .83rem; margin-top: .3rem; }

  /* ── GRID ── */
  .pb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 1.2rem; }
  @media(max-width: 500px) { .pb-grid { grid-template-columns: 1fr; } }

  /* ── BOOKING CARD ── */
  .pb-card {
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 22px; padding: 1.6rem;
    transition: border-color .25s, box-shadow .25s;
  }
  .pb-card:hover { border-color: rgba(255,107,53,.18); box-shadow: 0 8px 32px rgba(0,0,0,.35); }
  .pb-card.emergency { border-color: rgba(255,107,107,.3); }
  .pb-card.emergency:hover { border-color: rgba(255,107,107,.5); }

  /* card top */
  .pb-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; margin-bottom: 1rem; }
  .pb-card-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1rem; color: var(--sg-text);
  }

  /* emergency badge */
  .pb-emg {
    display: inline-flex; align-items: center; gap: .35rem;
    background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.25);
    border-radius: 100px; padding: .25rem .75rem;
    font-size: .7rem; font-weight: 700; color: #ff6b6b;
    margin-top: .35rem;
  }

  /* status badge */
  .pb-status {
    font-size: .68rem; font-weight: 600; padding: .22rem .7rem;
    border-radius: 100px; white-space: nowrap; text-transform: capitalize;
    flex-shrink: 0;
  }
  .pb-status-pending   { background: rgba(255,190,11,.1);  border: 1px solid rgba(255,190,11,.25);  color: var(--sg-accent2); }
  .pb-status-accepted  { background: rgba(74,222,128,.1);  border: 1px solid rgba(74,222,128,.25);  color: #4ade80; }
  .pb-status-completed { background: rgba(0,212,255,.1);   border: 1px solid rgba(0,212,255,.25);   color: var(--sg-cyan); }
  .pb-status-rejected  { background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.25); color: #ff6b6b; }
  .pb-status-cancelled { background: rgba(255,255,255,.06);border: 1px solid var(--sg-border);      color: var(--sg-muted); }

  /* meta chips */
  .pb-meta { display: flex; flex-wrap: wrap; gap: .55rem; margin-bottom: 1rem; }
  .pb-chip {
    display: flex; align-items: center; gap: .38rem;
    background: rgba(255,255,255,.04); border: 1px solid var(--sg-border);
    border-radius: 100px; padding: .3rem .8rem;
    font-size: .75rem; color: var(--sg-muted);
  }
  .pb-chip strong { color: var(--sg-text); font-weight: 600; }

  /* divider */
  .pb-hr { border: none; border-top: 1px solid var(--sg-border); margin: 1rem 0; }

  /* action buttons */
  .pb-actions { display: flex; gap: .7rem; margin-top: 1rem; }

  .pb-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: .4rem;
    padding: .7rem; border-radius: 11px; border: 1px solid;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .85rem;
    cursor: pointer; transition: transform .15s, background .2s;
  }
  .pb-btn:hover { transform: translateY(-1px); }

  .pb-btn-accept {
    background: rgba(74,222,128,.1); border-color: rgba(74,222,128,.25); color: #4ade80;
  }
  .pb-btn-accept:hover { background: rgba(74,222,128,.18); }

  .pb-btn-reject {
    background: rgba(255,107,107,.1); border-color: rgba(255,107,107,.25); color: #ff6b6b;
  }
  .pb-btn-reject:hover { background: rgba(255,107,107,.18); }

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
    orange: { val: "#ff6b35" },
    yellow: { val: "#ffbe0b" },
    green:  { val: "#4ade80" },
    cyan:   { val: "#00d4ff" },
    red:    { val: "#ff6b6b" },
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
              <ClipboardList size={22} style={{ color: "#ff6b35" }} />
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