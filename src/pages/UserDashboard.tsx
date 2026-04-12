import { useEffect, useState } from "react";
import axios from "axios";
import BookingTimeline from "../components/BookingTimeline";
import {
  CalendarDays,
  Clock,
  MapPin,
  X,
  RefreshCw,
  RotateCcw,
  Check,
  ClipboardList,
} from "lucide-react";

/* ─── Light theme styles ─── */
const UD_STYLE = `
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

  .ud-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding: 4rem 4% 4rem;
    position: relative;
  }
  
  /* mesh bg */
  .ud-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 80% 10%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 10% 80%, rgba(6,182,212,.05) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }
  
  .ud-wrap { position: relative; z-index: 1; max-width: 100%; margin: 0 auto; }

  /* ── page header ── */
  .ud-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .ud-header-icon {
    width: 44px; height: 44px; border-radius: 14px;
    background: rgba(59,130,246,.12);
    border: 1px solid rgba(59,130,246,.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ud-page-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: clamp(1.3rem, 4vw, 1.8rem);
    letter-spacing: -1px; color: var(--sg-text);
  }
  .ud-page-sub { color: var(--sg-muted); font-size: .8rem; margin-top: .1rem; }

  /* ── empty state ── */
  .ud-empty {
    text-align: center; padding: 5rem 2rem;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px;
  }
  .ud-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--sg-border);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.2rem;
  }
  .ud-empty h3 { font-family:'Inter',sans-serif; font-weight:700; font-size:1.1rem; color:var(--sg-text); }
  .ud-empty p  { color:var(--sg-muted); font-size:.88rem; margin-top:.35rem; }

  /* ── booking cards ── */
  .ud-cards { display: flex; flex-direction: column; gap: 1rem; }

  .ud-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 18px;
    padding: 1.2rem;
    transition: border-color .25s, box-shadow .25s;
  }
  .ud-card:hover {
    border-color: rgba(59,130,246,.18);
    box-shadow: 0 6px 24px rgba(59,130,246,.15);
  }

  /* card top row */
  .ud-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 0.8rem;
    flex-wrap: wrap;
  }
  .ud-card-title-row { display: flex; align-items: center; gap: 0.6rem; }
  .ud-svc-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ud-svc-name {
    font-family: 'Inter', sans-serif;
    font-weight: 700; font-size: 0.95rem; color: var(--sg-text);
  }

  /* meta chips row */
  .ud-meta {
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem;
  }
  .ud-chip {
    display: flex; align-items: center; gap: 0.35rem;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--sg-border);
    border-radius: 8px; padding: 0.3rem 0.7rem;
    font-size: 0.7rem; color: var(--sg-muted);
  }
  .ud-chip svg { flex-shrink:0; }
  .ud-chip strong { color: var(--sg-text); font-weight: 600; }

  /* divider */
  .ud-hr { border: none; border-top: 1px solid var(--sg-border); margin: 1.3rem 0; }

  /* action buttons */
  .ud-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }

  .ud-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.5rem 1rem; border-radius: 8px;
    font-family: 'Inter', sans-serif; font-weight: 500; font-size: 0.8rem;
    border: 1px solid; cursor: pointer; transition: background .2s, transform .15s;
  }
  .ud-btn:hover { transform: translateY(-1px); }

  .ud-btn-cancel {
    background: rgba(255,107,107,.08);
    border-color: rgba(255,107,107,.2);
    color: #ff6b6b;
  }
  .ud-btn-cancel:hover { background: rgba(255,107,107,.15); }

  .ud-btn-reschedule {
    background: rgba(255,190,11,.08);
    border-color: rgba(255,190,11,.2);
    color: var(--sg-accent2);
  }
  .ud-btn-reschedule:hover { background: rgba(255,190,11,.15); }

  .ud-btn-again {
    background: rgba(59,130,246,.1);
    border-color: rgba(59,130,246,.25);
    color: var(--sg-accent);
    box-shadow: 0 0 14px var(--sg-glow);
  }
  .ud-btn-again:hover { background: rgba(59,130,246,.18); }

  .ud-btn-confirm {
    background: rgba(74,222,128,.1);
    border-color: rgba(74,222,128,.25);
    color: #4ade80;
  }
  .ud-btn-confirm:hover { background: rgba(74,222,128,.18); }

  .ud-btn-cancel-sm {
    background: rgba(255,255,255,.04);
    border-color: var(--sg-border);
    color: var(--sg-muted);
  }
  .ud-btn-cancel-sm:hover { background: rgba(255,255,255,.08); color: var(--sg-text); }

  /* reschedule form */
  .ud-reschedule-form {
    margin-top: 1rem;
    background: rgba(255,255,255,.02);
    border: 1px solid var(--sg-border);
    border-radius: 14px; padding: 1rem;
  }
  .ud-rs-title {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.85rem;
    color: var(--sg-text); margin-bottom: 0.8rem;
  }
  .ud-rs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
  @media(max-width:500px){ .ud-rs-grid { grid-template-columns: 1fr; } }

  .ud-rs-label {
    display: block; font-size: 0.65rem; font-weight: 600;
    color: var(--sg-muted); letter-spacing: 0.3px;
    text-transform: uppercase; margin-bottom: 0.3rem;
  }
  .ud-rs-input, .ud-rs-select {
    width: 100%;
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 8px; padding: 0.5rem 0.7rem;
    color: var(--sg-text); font-family: 'Inter', sans-serif; font-size: 0.8rem;
    outline: none; transition: border-color .2s;
  }
  .ud-rs-input:focus, .ud-rs-select:focus { border-color: rgba(59,130,246,.45); }
  .ud-rs-select option { background: #1a1a26; color: var(--sg-text); }

  /* colorscheme for date input icon */
  .ud-rs-input::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
`;

function InjectUDStyle() {
  useEffect(() => {
    if (!document.getElementById("ud-style")) {
      const el = document.createElement("style");
      el.id = "ud-style";
      el.textContent = UD_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function UserDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const token = localStorage.getItem("token");

  const fetchBookings = () => {
    axios
      .get("https://servixobackend.vercel.app/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) { console.log(error); }
  };

  const rescheduleBooking = async (id: string) => {
    try {
      await axios.put(
        `https://servixobackend.vercel.app/api/bookings/reschedule/${id}`,
        { date: newDate, timeSlot: newSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRescheduleId(null); setNewDate(""); setNewSlot("");
      fetchBookings();
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <InjectUDStyle />
      <div className="ud-root">
        <div className="ud-wrap">

          {/* ── Page Header ── */}
          <div className="ud-header">
            <div className="ud-header-icon">
              <ClipboardList size={22} style={{ color: "#ff6b35" }} />
            </div>
            <div>
              <h1 className="ud-page-title">My Bookings</h1>
              <p className="ud-page-sub">Track, reschedule or cancel your service bookings</p>
            </div>
          </div>

          {/* ── Empty State ── */}
          {bookings.length === 0 && (
            <div className="ud-empty">
              <div className="ud-empty-icon">
                <ClipboardList size={28} style={{ color: "var(--sg-muted)" }} />
              </div>
              <h3>No bookings yet</h3>
              <p>Book a service to get started</p>
            </div>
          )}

          {/* ── Booking Cards ── */}
          <div className="ud-cards">
            {bookings.map((b) => (
              <div key={b._id} className="ud-card">

                {/* Top Row */}
                <div className="ud-card-top">
                  <div className="ud-card-title-row">
                    <div className="ud-svc-icon">
                      <RefreshCw size={20} style={{ color: "#ff6b35" }} />
                    </div>
                    <span className="ud-svc-name">{b.service?.title}</span>
                  </div>
                </div>

                {/* Meta chips */}
                <div className="ud-meta">
                  <div className="ud-chip">
                    <CalendarDays size={13} style={{ color: "#4ade80" }} />
                    <span>Date: <strong>{new Date(b.date).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="ud-chip">
                    <Clock size={13} style={{ color: "#00d4ff" }} />
                    <span>Slot: <strong>{b.timeSlot}</strong></span>
                  </div>
                  <div className="ud-chip">
                    <MapPin size={13} style={{ color: "#ff6b35" }} />
                    <span>
                      <strong>{b.address?.street}, {b.address?.city}</strong>
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="ud-hr" />
                <BookingTimeline status={b.status} />

                {/* Action Buttons */}
                {(b.status === "pending" || b.status === "accepted") && (
                  <div className="ud-actions">
                    <button
                      className="ud-btn ud-btn-cancel"
                      onClick={() => cancelBooking(b._id)}
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      className="ud-btn ud-btn-reschedule"
                      onClick={() => setRescheduleId(b._id)}
                    >
                      <CalendarDays size={14} /> Reschedule
                    </button>
                  </div>
                )}

                {/* Reschedule Form */}
                {rescheduleId === b._id && (
                  <div className="ud-reschedule-form">
                    <div className="ud-rs-title">
                      <Clock size={15} style={{ color: "#ff6b35" }} />
                      Select New Date & Time
                    </div>
                    <div className="ud-rs-grid">
                      <div>
                        <label className="ud-rs-label">New Date</label>
                        <input
                          type="date"
                          className="ud-rs-input"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="ud-rs-label">New Time Slot</label>
                        <select
                          className="ud-rs-select"
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                        >
                          <option value="">Select Slot</option>
                          <option>10AM - 12PM</option>
                          <option>12PM - 2PM</option>
                          <option>2PM - 4PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="ud-actions" style={{ marginTop: "1rem" }}>
                      <button
                        className="ud-btn ud-btn-confirm"
                        onClick={() => rescheduleBooking(b._id)}
                      >
                        <Check size={14} /> Confirm Reschedule
                      </button>
                      <button
                        className="ud-btn ud-btn-cancel-sm"
                        onClick={() => { setRescheduleId(null); setNewDate(""); setNewSlot(""); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Book Again */}
                {b.status === "completed" && (
                  <div className="ud-actions">
                    <button className="ud-btn ud-btn-again">
                      <RotateCcw size={14} /> Book Again
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default UserDashboard;