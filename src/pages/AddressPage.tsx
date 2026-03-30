import { useEffect } from "react";
import AddressManager from "../components/AddressManager";
import { MapPin } from "lucide-react";

/* ─── Light theme styles ─── */
const AP_STYLE = `
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

  .ap-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding: 6rem 5% 4rem;
    position: relative;
  }

  /* mesh bg */
  .ap-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 80% 10%, rgba(59,130,246,.08) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 10% 80%, rgba(6,182,212,.05) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .ap-wrap {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
  }

  /* ── page header ── */
  .ap-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 2rem;
  }
  .ap-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: rgba(59,130,246,.12);
    border: 1px solid rgba(59,130,246,.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ap-page-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800; font-size: clamp(1.5rem, 3vw, 2rem);
    letter-spacing: -1px; color: var(--sg-text);
  }
  .ap-page-sub {
    color: var(--sg-muted); font-size: .85rem; margin-top: .15rem;
  }

  /* ── card wrapper for AddressManager ── */
  .ap-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 1.8rem;
  }
`;

function InjectAPStyle() {
  useEffect(() => {
    if (!document.getElementById("ap-style")) {
      const el = document.createElement("style");
      el.id = "ap-style";
      el.textContent = AP_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

function AddressPage() {
  return (
    <>
      <InjectAPStyle />
      <div className="ap-root">
        <div className="ap-wrap">

          {/* Header */}
          <div className="ap-header">
            <div className="ap-header-icon">
              <MapPin size={22} style={{ color: "#ff6b35" }} />
            </div>
            <div>
              <h1 className="ap-page-title">My Addresses</h1>
              <p className="ap-page-sub">Manage your saved delivery addresses</p>
            </div>
          </div>

          {/* AddressManager wrapped in dark card */}
          <div className="ap-card">
            <AddressManager />
          </div>

        </div>
      </div>
    </>
  );
}

export default AddressPage;